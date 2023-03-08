import {
    BusinessEmail,
    BusinessId,
    BusinessReviewsAmount,
} from 'src/modules/shared/domain';
import { OnlineBusinessName, OnlineBusinessWebsite } from './';

export class OnlineBusiness {
    private bId: BusinessId;
    private bReviewsAmount: BusinessReviewsAmount;

    constructor(
        private bName: OnlineBusinessName,
        private bWebsite: OnlineBusinessWebsite,
        private bEmail: BusinessEmail,
    ) {
        this.bId = BusinessId.createId();
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

    includesName(name: OnlineBusinessName) {
        return this.bName.includes(name);
    }

    hasName(name: OnlineBusinessName) {
        return this.bName.equals(name);
    }

    hasId(id: BusinessId) {
        return this.bId.equals(id);
    }
}
