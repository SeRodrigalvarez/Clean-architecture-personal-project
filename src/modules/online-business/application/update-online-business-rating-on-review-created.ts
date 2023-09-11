import { Inject, Injectable } from '@nestjs/common';
import { ReviewCreatedEvent } from 'src/modules/reviews/domain';
import {
    BusinessAverageRating,
    BusinessType,
    DomainEventSubscriber,
    EVENT_BUS_PORT,
    EventBus,
    Id,
    QUERY_BUS_PORT,
    QueryBus,
} from 'src/modules/shared/domain';
import {
    GetAverageRatingByBusinessIdQuery,
    GetAverageRatingByBusinessIdQueryResponse,
} from 'src/modules/reviews/application';
import { OnlineBusinessViewUpdater } from '.';

@Injectable()
export class UpdateOnlineBusinessRatingOnReviewCreated
    implements DomainEventSubscriber<ReviewCreatedEvent>
{
    constructor(
        private onlineBusinessViewUpdater: OnlineBusinessViewUpdater,
        @Inject(QUERY_BUS_PORT)
        private queryBus: QueryBus,
        @Inject(EVENT_BUS_PORT)
        private eventBus: EventBus,
    ) {
        this.eventBus.addSubscriber(ReviewCreatedEvent.name, this);
    }

    async on(domainEvent: ReviewCreatedEvent): Promise<void> {
        if (domainEvent.type === BusinessType.ONLINE) {
            const getAverageRatingResult: GetAverageRatingByBusinessIdQueryResponse =
                await this.queryBus.ask(
                    new GetAverageRatingByBusinessIdQuery(
                        domainEvent.businessId,
                    ),
                );
            this.onlineBusinessViewUpdater.updateRatingData(
                Id.createFrom(domainEvent.businessId),
                BusinessAverageRating.createFrom(
                    getAverageRatingResult.avgRating,
                ),
            );
        }
    }
}
