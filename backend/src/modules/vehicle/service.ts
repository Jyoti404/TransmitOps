import { Prisma, VehicleStatus } from '@prisma/client';
import { prisma } from '../../common/prismaClient';
import { ConflictError, NotFoundError } from '../../common/errors';
import { CreateVehicleInput, ListVehiclesQuery, UpdateVehicleInput } from './validators';

const DISPATCHABLE_STATUSES: VehicleStatus[] = [VehicleStatus.AVAILABLE];

export async function createVehicle(input: CreateVehicleInput) {
  try {
    return await prisma.vehicle.create({ data: input });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new ConflictError(`Registration number '${input.registrationNumber}' is already in use`);
    }
    throw err;
  }
}

export async function listVehicles(query: ListVehiclesQuery) {
  return prisma.vehicle.findMany({
    where: {
      type: query.type ? { equals: query.type, mode: 'insensitive' } : undefined,
      status: query.status,
      region: query.region ? { equals: query.region, mode: 'insensitive' } : undefined,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function listAvailableVehicles() {
  return prisma.vehicle.findMany({
    where: { status: { in: DISPATCHABLE_STATUSES } },
    orderBy: { registrationNumber: 'asc' },
  });
}

export async function updateVehicle(id: string, input: UpdateVehicleInput) {
  const existing = await prisma.vehicle.findUnique({ where: { id } });
  if (!existing) {
    throw new NotFoundError(`Vehicle ${id} not found`);
  }

  try {
    return await prisma.vehicle.update({
      where: { id },
      data: { ...input, version: { increment: 1 } },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new ConflictError(`Registration number '${input.registrationNumber}' is already in use`);
    }
    throw err;
  }
}
