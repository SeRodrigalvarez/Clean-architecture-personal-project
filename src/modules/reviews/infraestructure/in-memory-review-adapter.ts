import { BusinessId } from 'src/modules/shared/domain';
import { Review } from '../domain';
import { GetResult, ReviewRepository } from '../domain';

export class InMemoryReviewAdapter implements ReviewRepository {
    private reviews: Review[] = [];

    create(review: Review) {
        this.reviews.push(review);
    }
    getByBusinessId(id: BusinessId): GetResult {
        throw new Error('Method not implemented.');
    }
}
