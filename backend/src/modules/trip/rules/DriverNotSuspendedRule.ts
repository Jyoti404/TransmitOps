import { DriverStatus } from '@prisma/client';
import { BusinessRuleViolation } from '../../../common/errors';
import { DispatchContext, DispatchRule } from './types';

export class DriverNotSuspendedRule implements DispatchRule {
  validate(ctx: DispatchContext): void {
    if (ctx.driver.status === DriverStatus.SUSPENDED) {
      throw new BusinessRuleViolation(`Driver ${ctx.driver.fullName} is suspended and cannot be assigned`);
    }
  }
}
