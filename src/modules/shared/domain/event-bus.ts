import { DomainEvent } from './domain-event';
import { DomainEventSubscriber } from './domain-event-subscriber';

export interface EventBus {
    publish(domainEvent: DomainEvent);
    addSubscriber(
        domainEvent: DomainEvent,
        domainEventSubscriber: DomainEventSubscriber,
    );
}
