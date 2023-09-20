import { Inject, Injectable } from '@nestjs/common';
import { BusinessEmail, Id } from 'src/modules/shared/domain';
import {
    CreateResultStatus,
    OnlineBusiness,
    OnlineBusinessName,
    OnlineBusinessRepository,
    OnlineBusinessWebsite,
    ONLINE_BUSINESS_PORT,
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
    constructor(
        @Inject(ONLINE_BUSINESS_PORT)
        private repository: OnlineBusinessRepository,
    ) {}

    async execute(
        id: Id,
        name: OnlineBusinessName,
        website: OnlineBusinessWebsite,
        email: BusinessEmail,
    ): Promise<OnlineBusinessCreatorResult> {
        const business = OnlineBusiness.createNew(id, name, website, email);
        const result = await this.repository.create(business);
        if (result.status === CreateResultStatus.BUSINESS_NAME_ALREADY_EXISTS) {
            return {
                status: OnlineBusinessCreatorResultStatus.BUSINESS_NAME_ALREADY_EXISTS,
            };
        }
        if (result.status === CreateResultStatus.GENERIC_ERROR) {
            return {
                status: OnlineBusinessCreatorResultStatus.GENERIC_ERROR,
            };
        }
        return {
            status: OnlineBusinessCreatorResultStatus.OK,
            id: business.id,
        };
    }
}
