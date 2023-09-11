import { Inject, Injectable, Logger } from '@nestjs/common';
import { Id, ReviewRating } from 'src/modules/shared/domain';
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
    ) {}

    async execute(
        id: Id,
        businessId: Id,
        text: ReviewText,
        rating: ReviewRating,
        username: Username,
    ): Promise<void> {
        const reviewView = ReviewView.create(
            id,
            businessId,
            text,
            rating,
            username,
        );
        const createResult = await this.reviewViewRepository.save(reviewView);
        if (createResult.status === SaveViewResultStatus.GENERIC_ERROR) {
            this.logger.error(`Error at review business view repository level`);
        }
    }
}
