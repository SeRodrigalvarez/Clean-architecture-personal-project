import { SaveResultStatus, Review } from '../domain';
import { ReviewRepository } from '../domain';

export class InMemoryReviewAdapter implements ReviewRepository {
    private reviews: Review[] = [];

    async save(review: Review) {
        if (this.isDuplicatedReview(review)) {
            return {
                status: SaveResultStatus.DUPLICATED_REVIEW,
            };
        }
        this.reviews.push(review);
        return {
            status: SaveResultStatus.OK,
        };
    }

    private isDuplicatedReview(checkReview: Review) {
        return this.reviews.find((review) => review.equals(checkReview));
    }
}
