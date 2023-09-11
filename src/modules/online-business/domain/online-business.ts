import { BusinessEmail, Id, AggregateRoot } from 'src/modules/shared/domain';
import {
    OnlineBusinessCreatedEvent,
    OnlineBusinessName,
    OnlineBusinessWebsite,
} from '.';

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
                aggregateId: onlineBusiness.id,
                name: onlineBusiness.name,
                website: onlineBusiness.website,
                email: onlineBusiness.email,
            }),
        );
        return onlineBusiness;
    }

    toPrimitives() {
        return {
            id: this.id,
            name: this.name,
            website: this.website,
            email: this.email,
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

    hasName(name: OnlineBusinessName) {
        return this.bName.equals(name);
    }

    hasWebsite(website: OnlineBusinessWebsite) {
        return this.bWebsite.equals(website);
    }
}
