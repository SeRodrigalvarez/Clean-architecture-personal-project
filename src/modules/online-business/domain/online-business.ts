import { BusinessEmail, Id, AggregateRoot } from 'src/modules/shared/domain';
import { OnlineBusinessName, OnlineBusinessWebsite } from './';
import { OnlineBusinessCreatedEvent } from './online-business-created-event';

export class OnlineBusiness extends AggregateRoot {
    private constructor(
        private bId: Id,
        private bName: OnlineBusinessName,
        private bWebsite: OnlineBusinessWebsite,
        private bEmail: BusinessEmail,
    ) {
        super();
    }

    static create(
        bId: Id,
        bName: OnlineBusinessName,
        bWebsite: OnlineBusinessWebsite,
        bEmail: BusinessEmail,
    ) {
        const onlineBusiness = new this(bId, bName, bWebsite, bEmail);
        onlineBusiness.record(
            new OnlineBusinessCreatedEvent({
                aggregateId: bId.value,
                name: bName.value,
                website: bWebsite.value,
                email: bEmail.value,
            }),
        );
        return onlineBusiness;
    }

    toPrimitives() {
        return {
            id: this.bId.value,
            name: this.bName.value,
            website: this.bWebsite.value,
            email: this.bEmail.value,
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
