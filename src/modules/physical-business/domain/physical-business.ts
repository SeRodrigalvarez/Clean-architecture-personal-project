import { AggregateRoot, BusinessEmail, Id } from 'src/modules/shared/domain';
import {
    PhysicalBusinessAddress,
    PhysicalBusinessCreatedEvent,
    PhysicalBusinessName,
    PhysicalBusinessPhone,
} from '.';

export class PhysicalBusiness extends AggregateRoot {
    private constructor(
        private bId: Id,
        private bName: PhysicalBusinessName,
        private bAddress: PhysicalBusinessAddress,
        private bPhone: PhysicalBusinessPhone,
        private bEmail: BusinessEmail,
    ) {
        super();
    }

    static create(
        bId: Id,
        bName: PhysicalBusinessName,
        bAddress: PhysicalBusinessAddress,
        bPhone: PhysicalBusinessPhone,
        bEmail: BusinessEmail,
    ) {
        const physicalBusiness = new this(bId, bName, bAddress, bPhone, bEmail);
        physicalBusiness.record(
            new PhysicalBusinessCreatedEvent({
                aggregateId: physicalBusiness.id,
                name: physicalBusiness.name,
                address: physicalBusiness.address,
                phone: physicalBusiness.phone,
                email: physicalBusiness.email,
            }),
        );
        return physicalBusiness;
    }

    toPrimitives() {
        return {
            id: this.id,
            name: this.name,
            address: this.address,
            phone: this.phone,
            email: this.email,
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

    hasName(name: PhysicalBusinessName) {
        return this.bName.equals(name);
    }

    hasPhone(phone: PhysicalBusinessPhone) {
        return this.bPhone.equals(phone);
    }
}
