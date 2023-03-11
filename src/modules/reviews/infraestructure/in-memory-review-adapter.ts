import { Id, PageSize, PageNumber } from 'src/modules/shared/domain';
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
    getByBusinessId(id: Id, pageNumber: PageNumber, pageSize: PageSize) {
        const start = pageNumber.value * pageSize.value;
        const end = start + pageSize.value;
        const result = this.reviews
            .filter((review) => review.hasBusinessId(id))
            .slice(start, end);

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
    getById(id: Id) {
        const result = this.reviews.find((review) => review.hasId(id));

        if (!result) {
            return {
                status: GetResultStatus.NOT_FOUND,
            };
        }

        return {
            status: GetResultStatus.OK,
            review: result,
        };
    }

    private isDuplicatedReview(checkReview: Review) {
        return this.reviews.find((review) => review.equals(checkReview));
    }
}
