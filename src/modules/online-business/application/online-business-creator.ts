import { Inject, Injectable, Logger } from '@nestjs/common';
import {
    BusinessEmail,
    EVENT_BUS_PORT,
    EventBus,
    Id,
} from 'src/modules/shared/domain';
import {
    OnlineBusiness,
    OnlineBusinessName,
    OnlineBusinessRepository,
    OnlineBusinessWebsite,
    ONLINE_BUSINESS_PORT,
    SaveResultStatus,
    SaveResult,
} from '../domain';

@Injectable()
export class OnlineBusinessCreator {
    private readonly logger = new Logger(OnlineBusinessCreator.name);

    constructor(
        @Inject(ONLINE_BUSINESS_PORT)
        private repository: OnlineBusinessRepository,
        @Inject(EVENT_BUS_PORT)
        private eventBus: EventBus,
    ) {}

    async execute(
        id: Id,
        name: OnlineBusinessName,
        website: OnlineBusinessWebsite,
        email: BusinessEmail,
    ): Promise<SaveResult> {
        const business = OnlineBusiness.create(id, name, website, email);
        const result = await this.repository.save(business);

        if (result.status === SaveResultStatus.OK) {
            business
                .pullDomainEvents()
                .forEach((event) => this.eventBus.publish(event));
        }

        return result;
    }
}
