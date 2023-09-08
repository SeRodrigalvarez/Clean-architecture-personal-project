import {
    BusinessEmail,
    DomainEventSubscriber,
    EVENT_BUS_PORT,
    EventBus,
    Id,
} from 'src/modules/shared/domain';
import {
    PhysicalBusinessAddress,
    PhysicalBusinessCreatedEvent,
    PhysicalBusinessName,
    PhysicalBusinessPhone,
} from '../domain';
import { PhysicalBusinessViewCreator } from '.';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CreatePhysicalBusinessViewOnPhysicalBusinessCreated
    implements DomainEventSubscriber<PhysicalBusinessCreatedEvent>
{
    constructor(
        private physicalBusinessViewCreator: PhysicalBusinessViewCreator,
        @Inject(EVENT_BUS_PORT)
        private eventBus: EventBus,
    ) {
        this.eventBus.addSubscriber(PhysicalBusinessCreatedEvent.name, this);
    }
    async on(domainEvent: PhysicalBusinessCreatedEvent): Promise<void> {
        this.physicalBusinessViewCreator.execute(
            Id.createFrom(domainEvent.aggregateId),
            new PhysicalBusinessName(domainEvent.name),
            new PhysicalBusinessAddress(
                domainEvent.address.street,
                domainEvent.address.city,
                domainEvent.address.postalCode,
                domainEvent.address.country,
            ),
            new PhysicalBusinessPhone(domainEvent.phone),
            new BusinessEmail(domainEvent.email),
        );
    }
}
