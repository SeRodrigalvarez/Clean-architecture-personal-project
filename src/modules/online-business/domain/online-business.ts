import {
    BusinessEmail,
    Id,
    BusinessReviewsAmount,
} from 'src/modules/shared/domain';
import { OnlineBusinessName, OnlineBusinessWebsite } from './';

export class OnlineBusiness {
    private bId: Id;
    private bReviewsAmount: BusinessReviewsAmount;

    constructor(
        private bName: OnlineBusinessName,
        private bWebsite: OnlineBusinessWebsite,
        private bEmail: BusinessEmail,
    ) {
        this.bId = Id.createId();
        this.bReviewsAmount = new BusinessReviewsAmount();
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

    includesName(name: OnlineBusinessName) {
        return this.bName.includes(name);
    }

    hasName(name: OnlineBusinessName) {
        return this.bName.equals(name);
    }

    hasId(id: Id) {
        return this.bId.equals(id);
    }
}
