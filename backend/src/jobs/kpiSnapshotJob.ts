import { prisma } from '../common/prismaClient';
import { computeKpis } from '../modules/dashboard/service';

function startOfToday(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}
export async function runKpiSnapshotJob() {
  const kpis = await computeKpis();
  const today = startOfToday();

  const snapshot = await prisma.dailyKpiSnapshot.upsert({
    where: { snapshotDate: today },
    update: {
      activeVehicles: kpis.activeVehicles,
      availableVehicles: kpis.availableVehicles,
      inShopVehicles: kpis.vehiclesInMaintenance,
      activeTrips: kpis.activeTrips,
      pendingTrips: kpis.pendingTrips,
      driversOnDuty: kpis.driversOnDuty,
      utilizationPct: kpis.fleetUtilizationPct,
    },
    create: {
      snapshotDate: today,
      activeVehicles: kpis.activeVehicles,
      availableVehicles: kpis.availableVehicles,
      inShopVehicles: kpis.vehiclesInMaintenance,
      activeTrips: kpis.activeTrips,
      pendingTrips: kpis.pendingTrips,
      driversOnDuty: kpis.driversOnDuty,
      utilizationPct: kpis.fleetUtilizationPct,
    },
  });

  console.log(`[CRON] kpi-snapshot: saved snapshot for ${today.toISOString().slice(0, 10)}`);

  return snapshot;
}
