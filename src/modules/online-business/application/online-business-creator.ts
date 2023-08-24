import { Inject, Injectable, Logger } from '@nestjs/common';
import { BusinessEmail, Id } from 'src/modules/shared/domain';
import {
    OnlineBusiness,
    OnlineBusinessName,
    OnlineBusinessRepository,
    OnlineBusinessWebsite,
    ONLINE_BUSINESS_PORT,
    SaveResultStatus,
} from '../domain';

@Injectable()
export class OnlineBusinessCreator {
    private readonly logger = new Logger(OnlineBusinessCreator.name);

    constructor(
        @Inject(ONLINE_BUSINESS_PORT)
        private repository: OnlineBusinessRepository,
    ) {}

    async execute(
        id: Id,
        name: OnlineBusinessName,
        website: OnlineBusinessWebsite,
        email: BusinessEmail,
    ) {
        const business = OnlineBusiness.create(id, name, website, email);
        const result = await this.repository.save(business);
        if (result.status === SaveResultStatus.BUSINESS_ALREADY_EXISTS) {
            if (result.isNameCollision) {
                this.logger.error(
                    `An online business with name ${name.value} already exists`,
                );
            }
            if (result.isWebsiteCollision) {
                this.logger.error(
                    `An online business with website ${website.value} already exists`,
                );
            }
        }
        if (result.status === SaveResultStatus.GENERIC_ERROR) {
            this.logger.error(`Error at online business repository level`);
        }
    }
}
