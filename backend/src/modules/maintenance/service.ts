import { MaintenanceStatus, VehicleStatus } from '@prisma/client';
import { prisma } from '../../common/prismaClient';
import { BusinessRuleViolation, NotFoundError } from '../../common/errors';
import { eventBus } from '../../common/eventBus';
import { CreateMaintenanceInput, ListMaintenanceQuery } from './validators';

export async function openMaintenance(input: CreateMaintenanceInput, actorUserId: string) {
  const log = await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM "vehicles" WHERE id = ${input.vehicleId} FOR UPDATE`;

    const vehicle = await tx.vehicle.findUnique({ where: { id: input.vehicleId } });
    if (!vehicle) throw new NotFoundError(`Vehicle ${input.vehicleId} not found`);

    if (vehicle.status !== VehicleStatus.AVAILABLE) {
      throw new BusinessRuleViolation(
        `Vehicle ${vehicle.registrationNumber} cannot be sent to maintenance while status is ${vehicle.status}`,
      );
    }

    const log = await tx.maintenanceLog.create({
      data: {
        vehicleId: input.vehicleId,
        description: input.description,
        cost: input.cost ?? 0,
        status: MaintenanceStatus.OPEN,
      },
    });

    await tx.vehicle.update({
      where: { id: input.vehicleId },
      data: { status: VehicleStatus.IN_SHOP, version: { increment: 1 } },
    });

    await tx.auditLog.create({
      data: {
        actorUserId,
        entityType: 'Vehicle',
        entityId: input.vehicleId,
        action: 'MAINTENANCE_OPEN',
        beforeState: { status: vehicle.status },
        afterState: { status: VehicleStatus.IN_SHOP, maintenanceLogId: log.id },
      },
    });

    return log;
  });

  eventBus.emitEvent('maintenance.opened', { maintenanceLogId: log.id, vehicleId: log.vehicleId });

  return log;
}

export async function closeMaintenance(id: string, actorUserId: string) {
  const updatedLog = await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM "maintenance_logs" WHERE id = ${id} FOR UPDATE`;

    const log = await tx.maintenanceLog.findUnique({ where: { id } });
    if (!log) throw new NotFoundError(`Maintenance log ${id} not found`);
    if (log.status === MaintenanceStatus.CLOSED) {
      throw new BusinessRuleViolation(`Maintenance log ${id} is already closed`);
    }

    const updatedLog = await tx.maintenanceLog.update({
      where: { id },
      data: { status: MaintenanceStatus.CLOSED, closedAt: new Date() },
    });

    const vehicle = await tx.vehicle.findUniqueOrThrow({ where: { id: log.vehicleId } });

    // Spec rule: closing maintenance restores the vehicle to Available, unless it was retired.
    if (vehicle.status !== VehicleStatus.RETIRED) {
      await tx.vehicle.update({
        where: { id: vehicle.id },
        data: { status: VehicleStatus.AVAILABLE, version: { increment: 1 } },
      });
    }

    await tx.auditLog.create({
      data: {
        actorUserId,
        entityType: 'Vehicle',
        entityId: vehicle.id,
        action: 'MAINTENANCE_CLOSE',
        beforeState: { status: vehicle.status, maintenanceLogId: id },
        afterState: { status: vehicle.status === VehicleStatus.RETIRED ? VehicleStatus.RETIRED : VehicleStatus.AVAILABLE },
      },
    });

    return updatedLog;
  });

  eventBus.emitEvent('maintenance.closed', { maintenanceLogId: id, vehicleId: updatedLog.vehicleId });

  return updatedLog;
}

export async function listMaintenance(query: ListMaintenanceQuery) {
  return prisma.maintenanceLog.findMany({
    where: { status: query.status, vehicleId: query.vehicleId },
    include: { vehicle: true },
    orderBy: { openedAt: 'desc' },
  });
}
