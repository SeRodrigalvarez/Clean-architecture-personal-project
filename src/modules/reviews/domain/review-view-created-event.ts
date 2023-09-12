import { DomainEvent } from 'src/modules/shared/domain';

export class ReviewViewCreatedEvent extends DomainEvent {
    readonly businessId: string;
    readonly text: string;
    readonly rating: number;
    readonly username: string;
    readonly businessType: number;

    constructor(params: {
        aggregateId: string;
        businessId: string;
        text: string;
        rating: number;
        username: string;
        businessType: number;
    }) {
        super({
            aggregateId: params.aggregateId,
            eventName: ReviewViewCreatedEvent.name,
        });
        this.businessId = params.businessId;
        this.text = params.text;
        this.rating = params.rating;
        this.username = params.username;
        this.businessType = params.businessType;
    }
}
