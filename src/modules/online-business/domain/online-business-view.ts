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
        private bReviewAmount: BusinessReviewsAmount,
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
            id: this.bId.value,
            name: this.bName.value,
            website: this.bWebsite.value,
            email: this.bEmail.value,
            reviewsAmount: this.bReviewAmount.value,
            averageRating: this.bAverageRating.value,
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

    get reviewAmount() {
        return this.bReviewAmount.value;
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

    hasName(name: OnlineBusinessName) {
        return this.bName.equals(name);
    }

    hasWebsite(website: OnlineBusinessWebsite) {
        return this.bWebsite.equals(website);
    }

    hasId(id: Id) {
        return this.bId.equals(id);
    }

    increaseReviewAmount() {
        this.bReviewAmount.increase();
    }

    decreaseReviewAmount() {
        this.bReviewAmount.decrease();
    }
}
