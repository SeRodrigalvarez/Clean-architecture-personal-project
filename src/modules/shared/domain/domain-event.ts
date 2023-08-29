import { Id } from '.';

export abstract class DomainEvent {
    readonly aggregateId: string;
    readonly eventId: string;
    readonly occurredOn: Date;
    readonly eventName: string;

    constructor(params: {
        eventId?: string;
        eventName: string;
        aggregateId: string;
        occurredOn?: Date;
    }) {
        const { aggregateId, eventId, occurredOn, eventName } = params;
        this.aggregateId = aggregateId;
        this.eventId = eventId || Id.createNew().value;
        this.occurredOn = occurredOn || new Date();
        this.eventName = eventName;
    }
}
