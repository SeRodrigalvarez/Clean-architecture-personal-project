import { BusinessId } from 'src/modules/shared/domain';
import { ReviewId, ReviewRating, ReviewText, Username } from './';

export class Review {
    private rId: ReviewId;

    constructor(
        private rBusinessId: BusinessId,
        private rText: ReviewText,
        private rRating: ReviewRating,
        private rUsername: Username,
    ) {
        this.rId = ReviewId.createId();
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
}
