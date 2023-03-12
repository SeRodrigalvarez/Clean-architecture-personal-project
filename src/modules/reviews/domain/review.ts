import { Id } from 'src/modules/shared/domain';
import { ReviewRating, ReviewText, Username } from './';

export class Review {
    private constructor(
        private rId: Id,
        private rBusinessId: Id,
        private rText: ReviewText,
        private rRating: ReviewRating,
        private rUsername: Username,
    ) {}

    static createNew(
        rBusinessId: Id,
        rText: ReviewText,
        rRating: ReviewRating,
        rUsername: Username,
    ) {
        return new this(Id.createNew(), rBusinessId, rText, rRating, rUsername);
    }

    static createFrom(
        rId: Id,
        rBusinessId: Id,
        rText: ReviewText,
        rRating: ReviewRating,
        rUsername: Username,
    ) {
        return new this(rId, rBusinessId, rText, rRating, rUsername);
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

    equals(review: Review) {
        return (
            this.rBusinessId.equals(review.rBusinessId) &&
            this.rUsername.equals(review.rUsername)
        );
    }

    hasId(id: Id) {
        return this.rId.equals(id);
    }

    hasBusinessId(id: Id) {
        return this.rBusinessId.equals(id);
    }
}
