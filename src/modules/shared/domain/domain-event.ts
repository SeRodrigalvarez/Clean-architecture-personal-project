import { Id } from '.';

export abstract class DomainEvent {
    static readonly EVENT_NAME: string;

    readonly aggregateId: string;
    readonly eventId: string;
    readonly occurredOn: Date;
    readonly eventName: string;

    constructor(params: {
        aggregateId: string;
        eventId?: string;
        occurredOn?: Date;
        eventName: string;
    }) {
        const { aggregateId, eventId, occurredOn, eventName } = params;
        this.aggregateId = aggregateId;
        this.eventId = eventId || Id.createNew().value;
        this.occurredOn = occurredOn || new Date();
        this.eventName = eventName;
    }
}
