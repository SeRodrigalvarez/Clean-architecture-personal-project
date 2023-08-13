import { DomainEvent } from './domain-event';

export interface DomainEventSubscriber {
    on(domainEvent: DomainEvent): Promise<void>;
}
