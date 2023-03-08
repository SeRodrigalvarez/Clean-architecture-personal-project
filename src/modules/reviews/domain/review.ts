import { Id } from 'src/modules/shared/domain';
import { ReviewRating, ReviewText, Username } from './';

export class Review {
    private rId: Id;

    constructor(
        private rBusinessId: Id,
        private rText: ReviewText,
        private rRating: ReviewRating,
        private rUsername: Username,
    ) {
        this.rId = Id.createId();
    }

    get id() {
        return this.rId;
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
}
