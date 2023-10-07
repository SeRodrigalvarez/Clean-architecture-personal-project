import { Inject, Injectable } from '@nestjs/common';
import { BusinessEmail, Id } from 'src/modules/shared/domain';
import {
    OnlineBusiness,
    OnlineBusinessName,
    OnlineBusinessRepository,
    OnlineBusinessWebsite,
    ONLINE_BUSINESS_PORT,
    SaveResult,
} from '../domain';

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
    ): Promise<SaveResult> {
        const business = OnlineBusiness.createNew(id, name, website, email);
        return await this.repository.save(business);
    }
}
