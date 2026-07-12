import { TripStatus, VehicleStatus, DriverStatus } from '@prisma/client';
import { prisma } from '../../common/prismaClient';
import { NotFoundError } from '../../common/errors';
import { eventBus } from '../../common/eventBus';
import { assertTransition } from './stateMachine';
import { dispatchRules } from './rules';
import { CompleteTripInput, CreateTripInput, ListTripsQuery } from './validators';

export async function createTrip(input: CreateTripInput, createdById: string) {
  const [vehicle, driver] = await Promise.all([
    prisma.vehicle.findUnique({ where: { id: input.vehicleId } }),
    prisma.driver.findUnique({ where: { id: input.driverId } }),
  ]);
  if (!vehicle) throw new NotFoundError(`Vehicle ${input.vehicleId} not found`);
  if (!driver) throw new NotFoundError(`Driver ${input.driverId} not found`);

  return prisma.trip.create({
    data: { ...input, createdById, status: TripStatus.DRAFT },
  });
}

export async function listTrips(query: ListTripsQuery) {
  return prisma.trip.findMany({
    where: { status: query.status },
    include: { vehicle: true, driver: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getTrip(id: string) {
  const trip = await prisma.trip.findUnique({
    where: { id },
    include: { vehicle: true, driver: true },
  });
  if (!trip) throw new NotFoundError(`Trip ${id} not found`);
  return trip;
}

/**
 * The correctness-critical path: two dispatch requests can race for the same
 * AVAILABLE vehicle/driver. We take a row lock (SELECT ... FOR UPDATE) on the
 * trip, vehicle and driver rows inside one transaction before re-reading their
 * live state and running the rules engine. Whichever request gets the lock
 * first wins; the second sees the already-updated status once it's unblocked
 * and cleanly fails a business rule instead of double-booking.
 */
export async function dispatchTrip(tripId: string, actorUserId: string) {
  const updatedTrip = await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM "trips" WHERE id = ${tripId} FOR UPDATE`;

    const trip = await tx.trip.findUnique({ where: { id: tripId } });
    if (!trip) throw new NotFoundError(`Trip ${tripId} not found`);
    assertTransition(trip.status, TripStatus.DISPATCHED);

    await tx.$queryRaw`SELECT id FROM "vehicles" WHERE id = ${trip.vehicleId} FOR UPDATE`;
    await tx.$queryRaw`SELECT id FROM "drivers" WHERE id = ${trip.driverId} FOR UPDATE`;

    const vehicle = await tx.vehicle.findUniqueOrThrow({ where: { id: trip.vehicleId } });
    const driver = await tx.driver.findUniqueOrThrow({ where: { id: trip.driverId } });

    dispatchRules.forEach((rule) => rule.validate({ vehicle, driver, cargoWeightKg: trip.cargoWeightKg }));

    const updatedTrip = await tx.trip.update({
      where: { id: tripId },
      data: { status: TripStatus.DISPATCHED, dispatchedAt: new Date() },
    });
    await tx.vehicle.update({
      where: { id: vehicle.id },
      data: { status: VehicleStatus.ON_TRIP, version: { increment: 1 } },
    });
    await tx.driver.update({
      where: { id: driver.id },
      data: { status: DriverStatus.ON_TRIP, version: { increment: 1 } },
    });

    await tx.auditLog.create({
      data: {
        actorUserId,
        entityType: 'Trip',
        entityId: tripId,
        action: 'DISPATCH',
        beforeState: { status: trip.status },
        afterState: { status: TripStatus.DISPATCHED, vehicleId: vehicle.id, driverId: driver.id },
      },
    });

    return updatedTrip;
  });

  // Fired only after the transaction actually commits — audit/cache/live-push
  // listeners must never react to a dispatch that got rolled back.
  eventBus.emitEvent('trip.dispatched', {
    tripId,
    vehicleId: updatedTrip.vehicleId,
    driverId: updatedTrip.driverId,
  });

  return updatedTrip;
}

export async function completeTrip(tripId: string, input: CompleteTripInput, actorUserId: string) {
  const updatedTrip = await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM "trips" WHERE id = ${tripId} FOR UPDATE`;

    const trip = await tx.trip.findUnique({ where: { id: tripId } });
    if (!trip) throw new NotFoundError(`Trip ${tripId} not found`);
    assertTransition(trip.status, TripStatus.COMPLETED);

    const updatedTrip = await tx.trip.update({
      where: { id: tripId },
      data: {
        status: TripStatus.COMPLETED,
        completedAt: new Date(),
        actualDistanceKm: input.actualDistanceKm,
        fuelConsumedLiters: input.fuelConsumedLiters,
      },
    });
    await tx.vehicle.update({
      where: { id: trip.vehicleId },
      data: {
        status: VehicleStatus.AVAILABLE,
        odometerKm: { increment: input.actualDistanceKm },
        version: { increment: 1 },
      },
    });
    await tx.driver.update({
      where: { id: trip.driverId },
      data: { status: DriverStatus.AVAILABLE, version: { increment: 1 } },
    });

    await tx.auditLog.create({
      data: {
        actorUserId,
        entityType: 'Trip',
        entityId: tripId,
        action: 'COMPLETE',
        beforeState: { status: trip.status },
        afterState: { status: TripStatus.COMPLETED },
      },
    });

    return updatedTrip;
  });

  eventBus.emitEvent('trip.completed', {
    tripId,
    vehicleId: updatedTrip.vehicleId,
    driverId: updatedTrip.driverId,
  });

  return updatedTrip;
}

export async function cancelTrip(tripId: string, actorUserId: string) {
  const updatedTrip = await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM "trips" WHERE id = ${tripId} FOR UPDATE`;

    const trip = await tx.trip.findUnique({ where: { id: tripId } });
    if (!trip) throw new NotFoundError(`Trip ${tripId} not found`);
    assertTransition(trip.status, TripStatus.CANCELLED);

    const wasDispatched = trip.status === TripStatus.DISPATCHED;

    const updatedTrip = await tx.trip.update({
      where: { id: tripId },
      data: { status: TripStatus.CANCELLED },
    });

    if (wasDispatched) {
      await tx.vehicle.update({
        where: { id: trip.vehicleId },
        data: { status: VehicleStatus.AVAILABLE, version: { increment: 1 } },
      });
      await tx.driver.update({
        where: { id: trip.driverId },
        data: { status: DriverStatus.AVAILABLE, version: { increment: 1 } },
      });
    }

    await tx.auditLog.create({
      data: {
        actorUserId,
        entityType: 'Trip',
        entityId: tripId,
        action: 'CANCEL',
        beforeState: { status: trip.status },
        afterState: { status: TripStatus.CANCELLED },
      },
    });

    return updatedTrip;
  });

  eventBus.emitEvent('trip.cancelled', {
    tripId,
    vehicleId: updatedTrip.vehicleId,
    driverId: updatedTrip.driverId,
  });

  return updatedTrip;
}
