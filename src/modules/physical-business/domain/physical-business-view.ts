import {
    BusinessAverageRating,
    BusinessEmail,
    BusinessReviewsAmount,
    Id,
} from 'src/modules/shared/domain';
import {
    PhysicalBusinessAddress,
    PhysicalBusinessName,
    PhysicalBusinessPhone,
} from '.';

export class PhysicalBusinessView {
    private constructor(
        private bId: Id,
        private bName: PhysicalBusinessName,
        private bAddress: PhysicalBusinessAddress,
        private bPhone: PhysicalBusinessPhone,
        private bEmail: BusinessEmail,
        private bReviewsAmount: BusinessReviewsAmount,
        private bAverageRating: BusinessAverageRating,
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
            BusinessAverageRating.createNew(),
        );
    }

    static createFrom(
        bId: Id,
        bName: PhysicalBusinessName,
        bAddress: PhysicalBusinessAddress,
        bPhone: PhysicalBusinessPhone,
        bEmail: BusinessEmail,
        bReviewsAmount: BusinessReviewsAmount,
        bAverageRating: BusinessAverageRating,
    ) {
        return new this(
            bId,
            bName,
            bAddress,
            bPhone,
            bEmail,
            bReviewsAmount,
            bAverageRating,
        );
    }

    toPrimitives() {
        return {
            id: this.bId.value,
            name: this.bName.value,
            address: this.bAddress.values,
            phone: this.bPhone.value,
            email: this.bEmail.value,
            reviewsAmount: this.bReviewsAmount.value,
            averageRating: this.bAverageRating.value,
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

    // NOTE: Not used
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

    get averageRating() {
        return this.bAverageRating.value;
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

    increaseReviewAmount() {
        this.bReviewsAmount.increase();
    }

    decreaseReviewAmount() {
        this.bReviewsAmount.decrease();
    }
}
