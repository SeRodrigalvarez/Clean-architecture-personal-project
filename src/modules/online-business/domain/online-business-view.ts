import {
    Id,
    BusinessEmail,
    BusinessReviewsAmount,
    BusinessAverageRating,
} from 'src/modules/shared/domain';
import { OnlineBusinessName, OnlineBusinessWebsite } from '.';

export class OnlineBusinessView {
    private constructor(
        private bId: Id,
        private bName: OnlineBusinessName,
        private bWebsite: OnlineBusinessWebsite,
        private bEmail: BusinessEmail,
        private bReviewsAmount: BusinessReviewsAmount,
        private bAverageRating: BusinessAverageRating,
    ) {}

    static createNew(
        bId: Id,
        bName: OnlineBusinessName,
        bWebsite: OnlineBusinessWebsite,
        bEmail: BusinessEmail,
    ) {
        return new this(
            bId,
            bName,
            bWebsite,
            bEmail,
            BusinessReviewsAmount.createNew(),
            BusinessAverageRating.createNew(),
        );
    }

    static createFrom(
        bId: Id,
        bName: OnlineBusinessName,
        bWebsite: OnlineBusinessWebsite,
        bEmail: BusinessEmail,
        bReviewsAmount: BusinessReviewsAmount,
        bAverageRating: BusinessAverageRating,
    ) {
        return new this(
            bId,
            bName,
            bWebsite,
            bEmail,
            bReviewsAmount,
            bAverageRating,
        );
    }

    toPrimitives() {
        return {
            id: this.id,
            name: this.name,
            website: this.website,
            email: this.email,
            reviewsAmount: this.reviewsAmount,
            averageRating: this.averageRating,
        };
    }

    get id() {
        return this.bId.value;
    }

    get name() {
        return this.bName.value;
    }

    get website() {
        return this.bWebsite.value;
    }

    get email() {
        return this.bEmail.value;
    }

    get reviewsAmount() {
        return this.bReviewsAmount.value;
    }

    get averageRating() {
        return this.bAverageRating.value;
    }

    includesName(value: string) {
        return this.bName.includes(value);
    }

    includesWebsite(value: string) {
        return this.bWebsite.includes(value);
    }

    hasId(id: Id) {
        return this.bId.equals(id);
    }

    increaseReviewsAmount() {
        this.bReviewsAmount.increase();
    }

    decreaseReviewsAmount() {
        this.bReviewsAmount.decrease();
    }

    setAverageRating(avgRating: BusinessAverageRating) {
        this.bAverageRating = avgRating;
    }
}
