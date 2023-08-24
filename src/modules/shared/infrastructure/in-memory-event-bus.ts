import { DomainEvent, DomainEventSubscriber, EventBus } from '../domain';

export class InMemoryEventBus implements EventBus {
    private domainEventSubscribers: Map<string, DomainEventSubscriber[]> =
        new Map();

    publish(domainEvent: DomainEvent) {
        this.domainEventSubscribers
            .get(domainEvent.eventName)
            .forEach((subscriber) => subscriber.on(domainEvent));
    }

    addSubscriber(
        domainEventName: string,
        domainEventSubscriber: DomainEventSubscriber,
    ) {
        const value = this.domainEventSubscribers.get(domainEventName);
        if (value) {
            value.push(domainEventSubscriber);
        } else {
            this.domainEventSubscribers.set(domainEventName, [
                domainEventSubscriber,
            ]);
        }
    }
}
