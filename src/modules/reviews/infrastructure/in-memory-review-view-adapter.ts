import { Id, PageSize, PageNumber } from 'src/modules/shared/domain';
import {
    GetViewResultStatus,
    ReviewView,
    ReviewViewRepository,
    SaveViewResultStatus,
} from '../domain';

export class InMemoryReviewViewAdapter implements ReviewViewRepository {
    private reviewViews: ReviewView[] = [];

    async save(reviewView: ReviewView) {
        this.reviewViews.push(reviewView);
        return {
            status: SaveViewResultStatus.OK,
        };
    }

    async getByBusinessId(id: Id, pageNumber: PageNumber, pageSize: PageSize) {
        const start = pageNumber.value * pageSize.value;
        const end = start + pageSize.value;
        const result = this.reviewViews
            .filter((review) => review.hasBusinessId(id))
            .slice(start, end);

        if (result.length === 0) {
            return {
                status: GetViewResultStatus.NOT_FOUND,
            };
        }

        return {
            status: GetViewResultStatus.OK,
            reviews: result,
        };
    }

    async getById(id: Id) {
        const result = this.reviewViews.find((review) => review.hasId(id));

        if (!result) {
            return {
                status: GetViewResultStatus.NOT_FOUND,
            };
        }

        return {
            status: GetViewResultStatus.OK,
            review: result,
        };
    }

    getAverageRatingByBusinessId(id: Id): Promise<number> {
        const reviewViews = this.reviewViews.filter((reviewView) =>
            reviewView.hasBusinessId(id),
        );
        const sum = reviewViews.reduce((acc, cur) => {
            return acc + cur.rating;
        }, 0);
        const amount = reviewViews.length;
        const result = Math.round((sum / amount) * 10) / 10;
        return new Promise((resolve) => resolve(result));
    }
}
