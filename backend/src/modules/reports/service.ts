import { TripStatus, VehicleStatus } from '@prisma/client';
import { prisma } from '../../common/prismaClient';

async function nonRetiredVehicles() {
  return prisma.vehicle.findMany({
    where: { status: { not: VehicleStatus.RETIRED } },
    select: { id: true, registrationNumber: true, acquisitionCost: true },
  });
}

export interface FuelEfficiencyRow {
  vehicleId: string;
  registrationNumber: string;
  totalDistanceKm: number;
  totalFuelLiters: number;
  efficiencyKmPerLiter: number | null;
}

export async function getFuelEfficiencyReport(): Promise<FuelEfficiencyRow[]> {
  const vehicles = await nonRetiredVehicles();

  const [distanceByVehicle, fuelByVehicle] = await Promise.all([
    prisma.trip.groupBy({
      by: ['vehicleId'],
      where: { status: TripStatus.COMPLETED },
      _sum: { actualDistanceKm: true },
    }),
    prisma.fuelLog.groupBy({ by: ['vehicleId'], _sum: { liters: true } }),
  ]);

  const distanceMap = new Map(distanceByVehicle.map((r) => [r.vehicleId, Number(r._sum.actualDistanceKm ?? 0)]));
  const fuelMap = new Map(fuelByVehicle.map((r) => [r.vehicleId, Number(r._sum.liters ?? 0)]));

  return vehicles.map((vehicle) => {
    const totalDistanceKm = distanceMap.get(vehicle.id) ?? 0;
    const totalFuelLiters = fuelMap.get(vehicle.id) ?? 0;
    return {
      vehicleId: vehicle.id,
      registrationNumber: vehicle.registrationNumber,
      totalDistanceKm,
      totalFuelLiters,
      efficiencyKmPerLiter: totalFuelLiters > 0 ? Number((totalDistanceKm / totalFuelLiters).toFixed(2)) : null,
    };
  });
}

export interface UtilizationTrendRow {
  date: string;
  activeVehicles: number;
  availableVehicles: number;
  inShopVehicles: number;
  utilizationPct: number;
}

export async function getUtilizationTrend(days: number): Promise<UtilizationTrendRow[]> {
  const snapshots = await prisma.dailyKpiSnapshot.findMany({
    orderBy: { snapshotDate: 'desc' },
    take: days,
  });

  return snapshots
    .reverse()
    .map((s) => ({
      date: s.snapshotDate.toISOString().slice(0, 10),
      activeVehicles: s.activeVehicles,
      availableVehicles: s.availableVehicles,
      inShopVehicles: s.inShopVehicles,
      utilizationPct: Number(s.utilizationPct),
    }));
}

export interface CostReportRow {
  vehicleId: string;
  registrationNumber: string;
  totalFuelCost: number;
  totalMaintenanceCost: number;
  totalExpenseCost: number;
  totalOperationalCost: number;
}

async function costAggregates() {
  const [fuelByVehicle, maintenanceByVehicle, expenseByVehicle] = await Promise.all([
    prisma.fuelLog.groupBy({ by: ['vehicleId'], _sum: { cost: true } }),
    prisma.maintenanceLog.groupBy({ by: ['vehicleId'], _sum: { cost: true } }),
    prisma.expense.groupBy({ by: ['vehicleId'], _sum: { amount: true } }),
  ]);

  return {
    fuelMap: new Map(fuelByVehicle.map((r) => [r.vehicleId, Number(r._sum.cost ?? 0)])),
    maintenanceMap: new Map(maintenanceByVehicle.map((r) => [r.vehicleId, Number(r._sum.cost ?? 0)])),
    // expense.vehicleId is nullable; groupBy still returns a row keyed by null for those, filter it out.
    expenseMap: new Map(
      expenseByVehicle.filter((r) => r.vehicleId !== null).map((r) => [r.vehicleId as string, Number(r._sum.amount ?? 0)]),
    ),
  };
}

export async function getCostReport(): Promise<CostReportRow[]> {
  const vehicles = await nonRetiredVehicles();
  const { fuelMap, maintenanceMap, expenseMap } = await costAggregates();

  return vehicles.map((vehicle) => {
    const totalFuelCost = fuelMap.get(vehicle.id) ?? 0;
    const totalMaintenanceCost = maintenanceMap.get(vehicle.id) ?? 0;
    const totalExpenseCost = expenseMap.get(vehicle.id) ?? 0;
    return {
      vehicleId: vehicle.id,
      registrationNumber: vehicle.registrationNumber,
      totalFuelCost,
      totalMaintenanceCost,
      totalExpenseCost,
      totalOperationalCost: totalFuelCost + totalMaintenanceCost + totalExpenseCost,
    };
  });
}

export interface RoiReportRow {
  vehicleId: string;
  registrationNumber: string;
  revenue: number;
  maintenanceCost: number;
  fuelCost: number;
  acquisitionCost: number;
  roi: number | null;
}

export async function getRoiReport(): Promise<RoiReportRow[]> {
  const vehicles = await nonRetiredVehicles();
  const { fuelMap, maintenanceMap } = await costAggregates();

  const revenueByVehicle = await prisma.trip.groupBy({
    by: ['vehicleId'],
    where: { status: TripStatus.COMPLETED },
    _sum: { revenue: true },
  });
  const revenueMap = new Map(revenueByVehicle.map((r) => [r.vehicleId, Number(r._sum.revenue ?? 0)]));

  return vehicles.map((vehicle) => {
    const revenue = revenueMap.get(vehicle.id) ?? 0;
    const maintenanceCost = maintenanceMap.get(vehicle.id) ?? 0;
    const fuelCost = fuelMap.get(vehicle.id) ?? 0;
    const acquisitionCost = Number(vehicle.acquisitionCost);

    // Spec formula is literally (Revenue - (Maintenance + Fuel)) / Acquisition Cost —
    // deliberately narrower than the Operational Cost report, which also folds in tolls/expenses.
    const roi = acquisitionCost > 0 ? Number(((revenue - (maintenanceCost + fuelCost)) / acquisitionCost).toFixed(4)) : null;

    return {
      vehicleId: vehicle.id,
      registrationNumber: vehicle.registrationNumber,
      revenue,
      maintenanceCost,
      fuelCost,
      acquisitionCost,
      roi,
    };
  });
}
