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
        bId: Id,
        bName: PhysicalBusinessName,
        bAddress: PhysicalBusinessAddress,
        bPhone: PhysicalBusinessPhone,
        bEmail: BusinessEmail,
    ) {
        return new this(
            bId,
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

    toPrimitives() {
        return {
            id: this.id,
            name: this.name,
            address: this.address,
            phone: this.phone,
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

    get address() {
        return this.bAddress.values;
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

    hasPhone(phone: PhysicalBusinessPhone) {
        return this.bPhone.equals(phone);
    }

    hasId(id: Id) {
        return this.bId.equals(id);
    }
}
