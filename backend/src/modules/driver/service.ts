import { Prisma, DriverStatus } from '@prisma/client';
import { prisma } from '../../common/prismaClient';
import { ConflictError, NotFoundError } from '../../common/errors';
import { CreateDriverInput, ListDriversQuery } from './validators';

export async function createDriver(input: CreateDriverInput) {
  try {
    return await prisma.driver.create({ data: input });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new ConflictError(`License number '${input.licenseNumber}' is already in use`);
    }
    throw err;
  }
}

export async function listDrivers(query: ListDriversQuery) {
  return prisma.driver.findMany({
    where: { status: query.status },
    orderBy: { createdAt: 'desc' },
  });
}

export async function listAvailableDrivers() {
  return prisma.driver.findMany({
    where: {
      status: DriverStatus.AVAILABLE,
      licenseExpiryDate: { gt: new Date() },
    },
    orderBy: { fullName: 'asc' },
  });
}

export async function suspendDriver(id: string, reason: string, actorUserId: string) {
  const driver = await prisma.driver.findUnique({ where: { id } });
  if (!driver) {
    throw new NotFoundError(`Driver ${id} not found`);
  }

  const [updated] = await prisma.$transaction([
    prisma.driver.update({
      where: { id },
      data: { status: DriverStatus.SUSPENDED, version: { increment: 1 } },
    }),
    prisma.auditLog.create({
      data: {
        actorUserId,
        entityType: 'Driver',
        entityId: id,
        action: 'SUSPEND',
        beforeState: { status: driver.status },
        afterState: { status: DriverStatus.SUSPENDED, reason },
      },
    }),
  ]);

  return updated;
}
