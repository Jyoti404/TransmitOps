import bcrypt from 'bcrypt';
import { prisma } from '../../common/prismaClient';
import { UnauthorizedError } from '../../common/errors';
import { signToken } from './jwt';

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.isActive) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const token = signToken({ sub: user.id, email: user.email, role: user.role });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
  };
}
