import { DriverStatus } from '@prisma/client';
import { BusinessRuleViolation } from '../../../common/errors';
import { DispatchContext, DispatchRule } from './types';

export class DriverAvailableRule implements DispatchRule {
  validate(ctx: DispatchContext): void {
    if (ctx.driver.status !== DriverStatus.AVAILABLE) {
      throw new BusinessRuleViolation(
        `Driver ${ctx.driver.fullName} is not available (status: ${ctx.driver.status})`,
      );
    }
  }
}
