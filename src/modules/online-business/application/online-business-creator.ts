import { Inject, Injectable, Logger } from '@nestjs/common';
import { BusinessEmail, Id } from 'src/modules/shared/domain';
import {
    OnlineBusiness,
    OnlineBusinessName,
    OnlineBusinessRepository,
    OnlineBusinessWebsite,
    ONLINE_BUSINESS_PORT,
    CreateResultStatus,
} from '../domain';

export interface OnlineBusinessCreatorResult {
    status: OnlineBusinessCreatorResultStatus;
    id?: string;
}

export enum OnlineBusinessCreatorResultStatus {
    OK,
    BUSINESS_NAME_ALREADY_EXISTS,
    GENERIC_ERROR,
}

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
        const business = OnlineBusiness.createNew(id, name, website, email);
        const result = await this.repository.create(business);
        if (result.status === CreateResultStatus.BUSINESS_ALREADY_EXISTS) {
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
        if (result.status === CreateResultStatus.GENERIC_ERROR) {
            this.logger.error(`Error at online business repository level`);
        }
    }
}
