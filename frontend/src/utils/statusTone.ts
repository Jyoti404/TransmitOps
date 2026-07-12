export const VEHICLE_STATUS_TONE = {
  AVAILABLE: 'green',
  ON_TRIP: 'blue',
  IN_SHOP: 'amber',
  RETIRED: 'gray',
} as const;

export const DRIVER_STATUS_TONE = {
  AVAILABLE: 'green',
  ON_TRIP: 'blue',
  OFF_DUTY: 'gray',
  SUSPENDED: 'red',
} as const;

export const TRIP_STATUS_TONE = {
  DRAFT: 'gray',
  DISPATCHED: 'blue',
  COMPLETED: 'green',
  CANCELLED: 'red',
} as const;
