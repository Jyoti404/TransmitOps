import { VehicleStatus } from '@prisma/client';
import { BusinessRuleViolation } from '../../../common/errors';
import { DispatchContext, DispatchRule } from './types';

export class VehicleAvailableRule implements DispatchRule {
  validate(ctx: DispatchContext): void {
    if (ctx.vehicle.status !== VehicleStatus.AVAILABLE) {
      throw new BusinessRuleViolation(
        `Vehicle ${ctx.vehicle.registrationNumber} is not available (status: ${ctx.vehicle.status})`,
      );
    }
  }
}
