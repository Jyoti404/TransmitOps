import { VehicleStatus, DriverStatus, TripStatus, Prisma } from '@prisma/client';
import { prisma } from '../../common/prismaClient';
import { buildKpiCacheKey, getCachedKpis, setCachedKpis } from './cache';
import { DashboardKpiQuery } from './validators';

export interface DashboardKpis {
  activeVehicles: number;
  availableVehicles: number;
  vehiclesInMaintenance: number;
  activeTrips: number;
  pendingTrips: number;
  driversOnDuty: number;
  fleetUtilizationPct: number;
}

export async function computeKpis(filters: DashboardKpiQuery = {}): Promise<DashboardKpis> {
  const vehicleWhere: Prisma.VehicleWhereInput = {
    type: filters.type,
    region: filters.region,
  };

  const [activeVehicles, availableVehicles, vehiclesInMaintenance, onTripVehicles, activeTrips, pendingTrips, driversOnDuty] =
    await Promise.all([
      prisma.vehicle.count({
        where: { ...vehicleWhere, status: filters.status ?? { not: VehicleStatus.RETIRED } },
      }),
      prisma.vehicle.count({ where: { ...vehicleWhere, status: VehicleStatus.AVAILABLE } }),
      prisma.vehicle.count({ where: { ...vehicleWhere, status: VehicleStatus.IN_SHOP } }),
      prisma.vehicle.count({ where: { ...vehicleWhere, status: VehicleStatus.ON_TRIP } }),
      prisma.trip.count({ where: { status: TripStatus.DISPATCHED } }),
      prisma.trip.count({ where: { status: TripStatus.DRAFT } }),
      prisma.driver.count({ where: { status: DriverStatus.ON_TRIP } }),
    ]);

  const fleetUtilizationPct = activeVehicles > 0 ? Number(((onTripVehicles / activeVehicles) * 100).toFixed(2)) : 0;

  return {
    activeVehicles,
    availableVehicles,
    vehiclesInMaintenance,
    activeTrips,
    pendingTrips,
    driversOnDuty,
    fleetUtilizationPct,
  };
}

export async function getDashboardKpis(filters: DashboardKpiQuery): Promise<DashboardKpis> {
  const cacheKey = buildKpiCacheKey(filters);

  const cached = await getCachedKpis<DashboardKpis>(cacheKey);
  if (cached) return cached;

  const kpis = await computeKpis(filters);
  await setCachedKpis(cacheKey, kpis);
  return kpis;
}
