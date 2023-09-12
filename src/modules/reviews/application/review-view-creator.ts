import { Inject, Injectable, Logger } from '@nestjs/common';
import {
    BusinessType,
    EVENT_BUS_PORT,
    EventBus,
    Id,
    ReviewRating,
} from 'src/modules/shared/domain';
import {
    ReviewText,
    Username,
    ReviewView,
    ReviewViewRepository,
    SaveViewResultStatus,
    REVIEW_REPOSITORY_VIEW_PORT,
} from '../domain';

@Injectable()
export class ReviewViewCreator {
    private readonly logger = new Logger(ReviewViewCreator.name);

    constructor(
        @Inject(REVIEW_REPOSITORY_VIEW_PORT)
        private reviewViewRepository: ReviewViewRepository,
        @Inject(EVENT_BUS_PORT)
        private eventBus: EventBus,
    ) {}

    async execute(
        id: Id,
        businessId: Id,
        text: ReviewText,
        rating: ReviewRating,
        username: Username,
        businessType: BusinessType,
    ): Promise<void> {
        const reviewView = ReviewView.create(
            id,
            businessId,
            text,
            rating,
            username,
            businessType,
        );
        const saveResult = await this.reviewViewRepository.save(reviewView);
        if (saveResult.status === SaveViewResultStatus.GENERIC_ERROR) {
            this.logger.error(`Error at review business view repository level`);
        }
        if (saveResult.status === SaveViewResultStatus.OK) {
            reviewView
                .pullDomainEvents()
                .forEach((event) => this.eventBus.publish(event));
        }
    }
}
