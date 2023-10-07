import {
    BusinessEmail,
    Id,
    BusinessReviewsAmount,
} from 'src/modules/shared/domain';
import { OnlineBusinessName, OnlineBusinessWebsite } from './';

export class OnlineBusiness {
    private constructor(
        private bId: Id,
        private bName: OnlineBusinessName,
        private bWebsite: OnlineBusinessWebsite,
        private bEmail: BusinessEmail,
        private bReviewsAmount: BusinessReviewsAmount,
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
        );
    }

    static createFrom(
        bId: Id,
        bName: OnlineBusinessName,
        bWebsite: OnlineBusinessWebsite,
        bEmail: BusinessEmail,
        bReviewsAmount: BusinessReviewsAmount,
    ) {
        return new this(bId, bName, bWebsite, bEmail, bReviewsAmount);
    }

    toPrimitives() {
        return {
            id: this.id,
            name: this.name,
            website: this.website,
            email: this.email,
            reviewsAmount: this.reviewsAmount,
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

    increaseReviewAmount() {
        this.bReviewsAmount.increase();
    }

    decreaseReviewAmount() {
        this.bReviewsAmount.decrease();
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
}
