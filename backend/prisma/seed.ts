import { PrismaClient, RoleName } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SEED_PASSWORD = 'Password123!';

const users: Array<{ email: string; fullName: string; role: RoleName }> = [
  { email: 'fleetmanager@transitops.local', fullName: 'Priya Sharma', role: RoleName.FLEET_MANAGER },
  { email: 'driver@transitops.local', fullName: 'Alex Mendes', role: RoleName.DRIVER },
  { email: 'safety@transitops.local', fullName: 'Meera Nair', role: RoleName.SAFETY_OFFICER },
  { email: 'finance@transitops.local', fullName: 'Raj Kapoor', role: RoleName.FINANCIAL_ANALYST },
];

async function main() {
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, passwordHash },
    });
  }

  console.log('Seeded users (all share the same password for demo convenience):');
  console.table(users.map((u) => ({ role: u.role, email: u.email, password: SEED_PASSWORD })));
  console.log(
    'Fleet Manager (fleetmanager@transitops.local) is the primary admin-style login — it owns vehicle registry and maintenance.',
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
