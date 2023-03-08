import { Id } from 'src/modules/shared/domain';
import { CreateResultStatus, Review } from '../domain';
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
    getByBusinessId(id: Id): GetResult {
        throw new Error('Method not implemented.');
    }

    private isDuplicatedReview(checkReview: Review) {
        return this.reviews.find((review) => review.equals(checkReview));
    }
}
