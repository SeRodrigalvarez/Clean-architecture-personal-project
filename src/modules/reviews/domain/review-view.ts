import {
    AggregateRoot,
    BusinessType,
    Id,
    ReviewRating,
} from 'src/modules/shared/domain';
import { ReviewText, ReviewViewCreatedEvent, Username } from '.';

export class ReviewView extends AggregateRoot {
    private constructor(
        private rId: Id,
        private rBusinessId: Id,
        private rText: ReviewText,
        private rRating: ReviewRating,
        private rUsername: Username,
        private rBusinessType: BusinessType,
    ) {
        super();
    }

    static create(
        rId: Id,
        rBusinessId: Id,
        rText: ReviewText,
        rRating: ReviewRating,
        rUsername: Username,
        rBusinessType: BusinessType,
    ) {
        const review = new this(
            rId,
            rBusinessId,
            rText,
            rRating,
            rUsername,
            rBusinessType,
        );
        review.record(
            new ReviewViewCreatedEvent({
                aggregateId: review.id,
                businessId: review.businessId,
                text: review.text,
                rating: review.rating,
                username: review.username,
                businessType: review.businessType,
            }),
        );
        return review;
    }

    toPrimitives() {
        return {
            id: this.id,
            businessId: this.businessId,
            text: this.text,
            rating: this.rating,
            username: this.username,
            businessType: this.businessType,
        };
    }

    get id() {
        return this.rId.value;
    }

    get businessId() {
        return this.rBusinessId.value;
    }

    get text() {
        return this.rText.value;
    }

    get rating() {
        return this.rRating.value;
    }

    get username() {
        return this.rUsername.value;
    }

    get businessType() {
        return this.rBusinessType;
    }

    hasId(id: Id) {
        return this.rId.equals(id);
    }

    hasBusinessId(id: Id) {
        return this.rBusinessId.equals(id);
    }
}
