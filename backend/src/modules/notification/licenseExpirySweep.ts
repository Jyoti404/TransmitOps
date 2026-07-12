import { DriverStatus } from '@prisma/client';
import { prisma } from '../../common/prismaClient';
import { sendMail } from './emailService';

function startOfToday(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

export interface LicenseExpirySweepResult {
  checked: number;
  notified: number;
  skipped: number;
}

// Proactive: the dispatch rules engine already BLOCKS assigning an
// expired-license driver, but that's reactive — this job flags it days
// before it becomes a blocked dispatch. Idempotent via the Notification
// table's (driverId, type, sentOn) unique constraint, safe to run more
// than once on the same day.
export async function runLicenseExpirySweep(): Promise<LicenseExpirySweepResult> {
  const today = startOfToday();
  const expiring = await prisma.driver.findMany({
    where: {
      status: { not: DriverStatus.SUSPENDED },
      licenseExpiryDate: { gte: today, lte: addDays(today, 7) },
    },
  });

  let notified = 0;
  let skipped = 0;

  for (const driver of expiring) {
    const alreadySent = await prisma.notification.findUnique({
      where: {
        driverId_type_sentOn: { driverId: driver.id, type: 'LICENSE_EXPIRY', sentOn: today },
      },
    });

    if (alreadySent) {
      skipped += 1;
      continue;
    }

    if (driver.email) {
      const expiry = driver.licenseExpiryDate.toISOString().slice(0, 10);
      await sendMail(
        driver.email,
        'Your driving license is expiring soon',
        `Hi ${driver.fullName}, your license (${driver.licenseNumber}) expires on ${expiry}. Please renew it before your next assigned trip.`,
      );
    }

    await prisma.notification.create({
      data: { driverId: driver.id, type: 'LICENSE_EXPIRY', sentOn: today },
    });
    notified += 1;
  }

  console.log(`[CRON] license-expiry-sweep: checked=${expiring.length} notified=${notified} skipped=${skipped}`);

  return { checked: expiring.length, notified, skipped };
}
