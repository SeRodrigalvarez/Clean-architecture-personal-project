import {
    Id,
    BusinessEmail,
    DomainEventSubscriber,
    EVENT_BUS_PORT,
    EventBus,
} from 'src/modules/shared/domain';
import {
    OnlineBusinessCreatedEvent,
    OnlineBusinessName,
    OnlineBusinessWebsite,
} from '../domain';
import { Inject, Injectable } from '@nestjs/common';
import { OnlineBusinessViewCreator } from '.';

@Injectable()
export class OnlineBusinessCreatedEventSubscriber
    implements DomainEventSubscriber<OnlineBusinessCreatedEvent>
{
    constructor(
        private onlineBusinessViewCreator: OnlineBusinessViewCreator,
        @Inject(EVENT_BUS_PORT)
        private eventBus: EventBus,
    ) {
        this.eventBus.addSubscriber(
            OnlineBusinessCreatedEvent.EVENT_NAME,
            this,
        );
    }

    async on(domainEvent: OnlineBusinessCreatedEvent): Promise<void> {
        this.onlineBusinessViewCreator.execute(
            Id.createFrom(domainEvent.aggregateId),
            new OnlineBusinessName(domainEvent.name),
            new OnlineBusinessWebsite(domainEvent.website),
            new BusinessEmail(domainEvent.email),
        );
    }
}
