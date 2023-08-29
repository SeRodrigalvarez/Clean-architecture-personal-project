import { DomainEvent } from '.';

export interface DomainEventSubscriber<E extends DomainEvent = DomainEvent> {
    on(domainEvent: E): Promise<void>;
}
