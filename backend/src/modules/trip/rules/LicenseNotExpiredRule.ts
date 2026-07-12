import { BusinessRuleViolation } from '../../../common/errors';
import { DispatchContext, DispatchRule } from './types';

export class LicenseNotExpiredRule implements DispatchRule {
  validate(ctx: DispatchContext): void {
    if (ctx.driver.licenseExpiryDate.getTime() <= Date.now()) {
      const expiry = ctx.driver.licenseExpiryDate.toISOString().slice(0, 10);
      throw new BusinessRuleViolation(`Driver ${ctx.driver.fullName}'s license expired on ${expiry}`);
    }
  }
}
