import { DomainEvent } from './domain-event';
import { DomainEventSubscriber } from './domain-event-subscriber';

export interface EventBus {
    publish(domainEvent: DomainEvent);
    addSubscriber(
        domainEventName: string,
        domainEventSubscriber: DomainEventSubscriber,
    );
}

export const EVENT_BUS_PORT = Symbol('EVENT_BUS_PORT');
