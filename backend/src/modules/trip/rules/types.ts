import { Driver, Vehicle } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export interface DispatchContext {
  vehicle: Vehicle;
  driver: Driver;
  cargoWeightKg: Decimal | number;
}

export interface DispatchRule {
  validate(ctx: DispatchContext): void;
}
