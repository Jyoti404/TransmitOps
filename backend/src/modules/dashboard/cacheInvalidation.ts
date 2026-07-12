import { DomainEvent, eventBus } from '../../common/eventBus';
import { invalidateKpiCache } from './cache';

const INVALIDATING_EVENTS: DomainEvent[] = [
  'trip.dispatched',
  'trip.completed',
  'trip.cancelled',
  'maintenance.opened',
  'maintenance.closed',
];
INVALIDATING_EVENTS.forEach((event) => {
  eventBus.onEvent(event, () => {
    void invalidateKpiCache();
  });
});
