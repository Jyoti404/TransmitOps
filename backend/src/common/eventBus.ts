import { EventEmitter } from 'events';

export type DomainEvent =
  | 'trip.dispatched'
  | 'trip.completed'
  | 'trip.cancelled'
  | 'maintenance.opened'
  | 'maintenance.closed';

class TypedEventBus extends EventEmitter {
  emitEvent(event: DomainEvent, payload: Record<string, unknown>) {
    this.emit(event, payload);
  }

  onEvent(event: DomainEvent, listener: (payload: Record<string, unknown>) => void) {
    this.on(event, listener);
  }
}

// Internal pub/sub for decoupling side effects (audit, cache invalidation, live push)
// from the modules that trigger state changes. Swappable for Kafka/RabbitMQ later
// without touching any of the emitting call sites.
export const eventBus = new TypedEventBus();
