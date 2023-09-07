import { Inject, Injectable, Logger } from '@nestjs/common';
import {
    BusinessEmail,
    EVENT_BUS_PORT,
    EventBus,
    Id,
} from 'src/modules/shared/domain';
import {
    PhysicalBusiness,
    PhysicalBusinessAddress,
    PhysicalBusinessName,
    PhysicalBusinessPhone,
    PhysicalBusinessRepository,
    PHYSICAL_BUSINESS_PORT,
    SaveResultStatus,
    SaveResult,
} from '../domain';

@Injectable()
export class PhysicalBusinessCreator {
    private readonly logger = new Logger(PhysicalBusinessCreator.name);

    constructor(
        @Inject(PHYSICAL_BUSINESS_PORT)
        private repository: PhysicalBusinessRepository,
        @Inject(EVENT_BUS_PORT)
        private eventBus: EventBus,
    ) {}

    async execute(
        id: Id,
        name: PhysicalBusinessName,
        address: PhysicalBusinessAddress,
        phone: PhysicalBusinessPhone,
        email: BusinessEmail,
    ): Promise<SaveResult> {
        const business = PhysicalBusiness.create(
            id,
            name,
            address,
            phone,
            email,
        );
        const result = await this.repository.save(business);

        if (result.status === SaveResultStatus.OK) {
            business
                .pullDomainEvents()
                .forEach((event) => this.eventBus.publish(event));
        }

        return result;
    }
}
