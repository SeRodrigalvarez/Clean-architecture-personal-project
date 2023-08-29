import { DomainEvent } from 'src/modules/shared/domain';

export class OnlineBusinessCreatedEvent extends DomainEvent {
    static readonly EVENT_NAME = 'online-business.created';

    readonly name: string;
    readonly website: string;
    readonly email: string;

    constructor(params: {
        aggregateId: string;
        name: string;
        website: string;
        email: string;
    }) {
        super({
            aggregateId: params.aggregateId,
            eventName: OnlineBusinessCreatedEvent.EVENT_NAME,
        });
        this.name = params.name;
        this.website = params.website;
        this.email = params.email;
    }
}
