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
    private constructor(
        private bId: Id,
        private bName: PhysicalBusinessName,
        private bAddress: PhysicalBusinessAddress,
        private bPhone: PhysicalBusinessPhone,
        private bEmail: BusinessEmail,
        private bReviewsAmount: BusinessReviewsAmount,
    ) {}

    static createNew(
        bName: PhysicalBusinessName,
        bAddress: PhysicalBusinessAddress,
        bPhone: PhysicalBusinessPhone,
        bEmail: BusinessEmail,
    ) {
        return new this(
            Id.createNew(),
            bName,
            bAddress,
            bPhone,
            bEmail,
            BusinessReviewsAmount.createNew(),
        );
    }

    static createFrom(
        bId: Id,
        bName: PhysicalBusinessName,
        bAddress: PhysicalBusinessAddress,
        bPhone: PhysicalBusinessPhone,
        bEmail: BusinessEmail,
        bReviewsAmount: BusinessReviewsAmount,
    ) {
        return new this(bId, bName, bAddress, bPhone, bEmail, bReviewsAmount);
    }

    get id() {
        return this.bId.value;
    }

    get name() {
        return this.bName.value;
    }

    get address() {
        return this.bAddress.values;
    }

    get addressString() {
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

    includesName(value: string) {
        return this.bName.includes(value);
    }

    includesAddress(value: string) {
        return this.bAddress.includes(value);
    }

    hasName(name: PhysicalBusinessName) {
        return this.bName.equals(name);
    }

    hasId(id: Id) {
        return this.bId.equals(id);
    }
}
