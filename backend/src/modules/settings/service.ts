import { prisma } from '../../common/prismaClient';
import { UpdateSettingsInput } from './validators';

const SETTINGS_ID = 1;

// upsert instead of a plain findUnique so the very first read/write works
// even before anyone has explicitly created the singleton row.
export async function getSettings() {
  return prisma.appSettings.upsert({
    where: { id: SETTINGS_ID },
    update: {},
    create: { id: SETTINGS_ID },
  });
}

export async function updateSettings(input: UpdateSettingsInput) {
  return prisma.appSettings.upsert({
    where: { id: SETTINGS_ID },
    update: input,
    create: { id: SETTINGS_ID, ...input },
  });
}
