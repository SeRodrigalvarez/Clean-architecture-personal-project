import { Id } from 'src/modules/shared/domain';
import { CreateResultStatus, GetResultStatus, Review } from '../domain';
import { ReviewRepository } from '../domain';

export class InMemoryReviewAdapter implements ReviewRepository {
    private reviews: Review[] = [];

    create(review: Review) {
        if (this.isDuplicatedReview(review)) {
            return {
                status: CreateResultStatus.DUPLICATED_REVIEW,
            };
        }
        this.reviews.push(review);
        return {
            status: CreateResultStatus.OK,
        };
    }
    getByBusinessId(id: Id) {
        const result = this.reviews.filter((review) =>
            review.hasBusinessId(id),
        );

        if (result.length === 0) {
            return {
                status: GetResultStatus.NOT_FOUND,
            };
        }

        return {
            status: GetResultStatus.OK,
            reviews: result,
        };
    }

    private isDuplicatedReview(checkReview: Review) {
        return this.reviews.find((review) => review.equals(checkReview));
    }
}
