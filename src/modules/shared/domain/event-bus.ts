import { DomainEvent, DomainEventSubscriber } from '.';

export interface EventBus {
    publish(domainEvent: DomainEvent);
    addSubscriber(
        domainEventName: string,
        domainEventSubscriber: DomainEventSubscriber,
    );
}

export const EVENT_BUS_PORT = Symbol('EVENT_BUS_PORT');
