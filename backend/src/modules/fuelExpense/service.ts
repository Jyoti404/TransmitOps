import { prisma } from '../../common/prismaClient';
import { NotFoundError } from '../../common/errors';
import {
  CreateExpenseInput,
  CreateFuelLogInput,
  ListExpensesQuery,
  ListFuelLogsQuery,
} from './validators';

export async function createFuelLog(input: CreateFuelLogInput) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: input.vehicleId } });
  if (!vehicle) throw new NotFoundError(`Vehicle ${input.vehicleId} not found`);

  return prisma.fuelLog.create({ data: input });
}

export async function listFuelLogs(query: ListFuelLogsQuery) {
  return prisma.fuelLog.findMany({
    where: { vehicleId: query.vehicleId, tripId: query.tripId },
    orderBy: { loggedDate: 'desc' },
  });
}

export async function createExpense(input: CreateExpenseInput) {
  if (input.vehicleId) {
    const vehicle = await prisma.vehicle.findUnique({ where: { id: input.vehicleId } });
    if (!vehicle) throw new NotFoundError(`Vehicle ${input.vehicleId} not found`);
  }

  return prisma.expense.create({ data: input });
}

export async function listExpenses(query: ListExpensesQuery) {
  return prisma.expense.findMany({
    where: { vehicleId: query.vehicleId, tripId: query.tripId, category: query.category },
    orderBy: { expenseDate: 'desc' },
  });
}

export async function getVehicleCostSummary(vehicleId: string) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) throw new NotFoundError(`Vehicle ${vehicleId} not found`);

  const [fuelAgg, maintenanceAgg, expenseAgg] = await Promise.all([
    prisma.fuelLog.aggregate({ where: { vehicleId }, _sum: { cost: true } }),
    prisma.maintenanceLog.aggregate({ where: { vehicleId }, _sum: { cost: true } }),
    prisma.expense.aggregate({ where: { vehicleId }, _sum: { amount: true } }),
  ]);

  const totalFuelCost = Number(fuelAgg._sum.cost ?? 0);
  const totalMaintenanceCost = Number(maintenanceAgg._sum.cost ?? 0);
  const totalExpenseCost = Number(expenseAgg._sum.amount ?? 0);

  return {
    vehicleId,
    registrationNumber: vehicle.registrationNumber,
    totalFuelCost,
    totalMaintenanceCost,
    totalExpenseCost,
    totalOperationalCost: totalFuelCost + totalMaintenanceCost + totalExpenseCost,
  };
}
