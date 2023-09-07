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
                aggregateId: bId.value,
                name: bName.value,
                address: bAddress.values,
                phone: bPhone.value,
                email: bEmail.value,
            }),
        );
        return physicalBusiness;
    }

    toPrimitives() {
        return {
            id: this.bId.value,
            name: this.bName.value,
            address: this.bAddress.values,
            phone: this.bPhone.value,
            email: this.bEmail.value,
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
