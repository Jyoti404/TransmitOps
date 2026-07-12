import { DispatchRule } from './types';
import { VehicleAvailableRule } from './VehicleAvailableRule';
import { DriverNotSuspendedRule } from './DriverNotSuspendedRule';
import { DriverAvailableRule } from './DriverAvailableRule';
import { LicenseNotExpiredRule } from './LicenseNotExpiredRule';
import { CargoWeightWithinCapacityRule } from './CargoWeightWithinCapacityRule';

// Order matters: fail on the cheapest/clearest check first.
export const dispatchRules: DispatchRule[] = [
  new VehicleAvailableRule(),
  new DriverNotSuspendedRule(),
  new DriverAvailableRule(),
  new LicenseNotExpiredRule(),
  new CargoWeightWithinCapacityRule(),
];

export * from './types';
