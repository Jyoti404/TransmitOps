import { NextFunction, Request, Response } from 'express';
import { RoleName } from '@prisma/client';
import { UnauthorizedError, ForbiddenError } from '../errors';
import { verifyToken } from '../../modules/auth/jwt';

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or malformed Authorization header');
  }

  const token = header.slice('Bearer '.length);

  try {
    req.user = verifyToken(token);
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }

  next();
}

export function requireRole(...roles: RoleName[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError();
    }
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError(`Requires one of roles: ${roles.join(', ')}`);
    }
    next();
  };
}
