import { BusinessRuleViolation } from '../../../common/errors';
import { DispatchContext, DispatchRule } from './types';

export class CargoWeightWithinCapacityRule implements DispatchRule {
  validate(ctx: DispatchContext): void {
    const cargoWeight = Number(ctx.cargoWeightKg);
    const capacity = Number(ctx.vehicle.maxLoadCapacityKg);

    if (cargoWeight > capacity) {
      throw new BusinessRuleViolation(
        `Cargo weight ${cargoWeight}kg exceeds vehicle ${ctx.vehicle.registrationNumber}'s capacity of ${capacity}kg`,
      );
    }
  }
}
