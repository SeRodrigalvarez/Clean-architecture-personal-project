import {
    DomainEventSubscriber,
    EVENT_BUS_PORT,
    EventBus,
    Id,
    ReviewRating,
} from 'src/modules/shared/domain';
import { ReviewCreatedEvent, ReviewText, Username } from '../domain';
import { ReviewViewCreator } from '.';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CreateReviewViewOnReviewCreated
    implements DomainEventSubscriber<ReviewCreatedEvent>
{
    constructor(
        private reviewViewCreator: ReviewViewCreator,
        @Inject(EVENT_BUS_PORT)
        private eventBus: EventBus,
    ) {
        this.eventBus.addSubscriber(ReviewCreatedEvent.name, this);
    }
    async on(domainEvent: ReviewCreatedEvent): Promise<void> {
        this.reviewViewCreator.execute(
            Id.createFrom(domainEvent.aggregateId),
            Id.createFrom(domainEvent.businessId),
            new ReviewText(domainEvent.text),
            new ReviewRating(domainEvent.rating),
            new Username(domainEvent.username),
            domainEvent.businessType,
        );
    }
}
