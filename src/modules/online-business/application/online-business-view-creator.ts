import { Inject, Injectable, Logger } from '@nestjs/common';
import {
    ONLINE_BUSINESS_VIEW_PORT,
    OnlineBusinessName,
    OnlineBusinessView,
    OnlineBusinessViewRepository,
    OnlineBusinessWebsite,
    SaveViewResultStatus,
} from '../domain';
import { Id, BusinessEmail } from 'src/modules/shared/domain';

@Injectable()
export class OnlineBusinessViewCreator {
    private readonly logger = new Logger(OnlineBusinessViewCreator.name);

    constructor(
        @Inject(ONLINE_BUSINESS_VIEW_PORT)
        private repository: OnlineBusinessViewRepository,
    ) {}

    async execute(
        id: Id,
        name: OnlineBusinessName,
        website: OnlineBusinessWebsite,
        email: BusinessEmail,
    ) {
        const business = OnlineBusinessView.createNew(id, name, website, email);
        const result = await this.repository.save(business);

        if (result.status === SaveViewResultStatus.GENERIC_ERROR) {
            this.logger.error(`Error at online business view repository level`);
        }
    }
}
