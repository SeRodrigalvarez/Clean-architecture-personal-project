import { Id, ReviewRating } from 'src/modules/shared/domain';
import { ReviewText, Username } from '.';

export class ReviewView {
    private constructor(
        private rId: Id,
        private rBusinessId: Id,
        private rText: ReviewText,
        private rRating: ReviewRating,
        private rUsername: Username,
    ) {}

    static create(
        rId: Id,
        rBusinessId: Id,
        rText: ReviewText,
        rRating: ReviewRating,
        rUsername: Username,
    ) {
        return new this(rId, rBusinessId, rText, rRating, rUsername);
    }

    toPrimitives() {
        return {
            id: this.id,
            businessId: this.businessId,
            text: this.text,
            rating: this.rating,
            username: this.username,
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

    hasId(id: Id) {
        return this.rId.equals(id);
    }

    hasBusinessId(id: Id) {
        return this.rBusinessId.equals(id);
    }
}
