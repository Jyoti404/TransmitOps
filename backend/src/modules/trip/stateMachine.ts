import { TripStatus } from '@prisma/client';
import { ConflictError } from '../../common/errors';

const TRIP_TRANSITIONS: Record<TripStatus, TripStatus[]> = {
  DRAFT: [TripStatus.DISPATCHED, TripStatus.CANCELLED],
  DISPATCHED: [TripStatus.COMPLETED, TripStatus.CANCELLED],
  COMPLETED: [],
  CANCELLED: [],
};

export function assertTransition(from: TripStatus, to: TripStatus) {
  if (!TRIP_TRANSITIONS[from].includes(to)) {
    throw new ConflictError(`Cannot move trip from ${from} to ${to}`);
  }
}
