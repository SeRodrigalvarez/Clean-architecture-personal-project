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
            id: this.id,
            name: this.name,
            address: this.address,
            phone: this.phone,
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

    get averageRating() {
        return this.bAverageRating.value;
    }

    includesName(value: string) {
        return this.bName.includes(value);
    }

    includesAddress(value: string) {
        return this.bAddress.includes(value);
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

    setAverageRating(avgRating: BusinessAverageRating) {
        this.bAverageRating = avgRating;
    }
}
