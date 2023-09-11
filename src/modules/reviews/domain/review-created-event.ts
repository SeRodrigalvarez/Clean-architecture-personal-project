import { DomainEvent } from 'src/modules/shared/domain';

export class ReviewCreatedEvent extends DomainEvent {
    readonly businessId: string;
    readonly text: string;
    readonly rating: number;
    readonly username: string;
    readonly type: number;

    constructor(params: {
        aggregateId: string;
        businessId: string;
        text: string;
        rating: number;
        username: string;
        type: number;
    }) {
        super({
            aggregateId: params.aggregateId,
            eventName: ReviewCreatedEvent.name,
        });
        this.businessId = params.businessId;
        this.text = params.text;
        this.rating = params.rating;
        this.username = params.username;
        this.type = params.type;
    }
}
