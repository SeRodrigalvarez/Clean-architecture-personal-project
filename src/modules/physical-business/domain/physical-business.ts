import {
    BusinessEmail,
    BusinessReviewsAmount,
    Id,
} from 'src/modules/shared/domain';
import {
    PhysicalBusinessAddress,
    PhysicalBusinessName,
    PhysicalBusinessPhone,
} from './';

export class PhysicalBusiness {
    private bId: Id;
    private bReviewsAmount: BusinessReviewsAmount;

    constructor(
        private bName: PhysicalBusinessName,
        private bAddress: PhysicalBusinessAddress,
        private bPhone: PhysicalBusinessPhone,
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

    get address() {
        return this.bAddress.toString();
    }

    get phone() {
        return this.bPhone.value;
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

    includesName(name: PhysicalBusinessName) {
        return this.bName.includes(name);
    }

    hasName(name: PhysicalBusinessName) {
        return this.bName.equals(name);
    }

    hasId(id: Id) {
        return this.bId.equals(id);
    }
}
