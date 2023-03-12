import { Inject, Injectable } from '@nestjs/common';
import { BusinessEmail } from 'src/modules/shared/domain';
import {
    CreateResultStatus,
    PhysicalBusiness,
    PhysicalBusinessAddress,
    PhysicalBusinessName,
    PhysicalBusinessPhone,
    PhysicalBusinessRepository,
    PHYSICAL_BUSINESS_PORT,
} from '../domain';

export interface PhysicalBusinessCreatorResult {
    status: PhysicalBusinessCreatorResultStatus;
    id?: string;
}

export enum PhysicalBusinessCreatorResultStatus {
    OK,
    BUSINESS_NAME_ALREADY_EXISTS,
    GENERIC_ERROR,
}

@Injectable()
export class PhysicalBusinessCreator {
    constructor(
        @Inject(PHYSICAL_BUSINESS_PORT)
        private repository: PhysicalBusinessRepository,
    ) {}

    async execute(
        name: PhysicalBusinessName,
        address: PhysicalBusinessAddress,
        phone: PhysicalBusinessPhone,
        email: BusinessEmail,
    ): Promise<PhysicalBusinessCreatorResult> {
        const business = PhysicalBusiness.createNew(
            name,
            address,
            phone,
            email,
        );
        const result = await this.repository.create(business);
        if (result.status === CreateResultStatus.BUSINESS_NAME_ALREADY_EXISTS) {
            return {
                status: PhysicalBusinessCreatorResultStatus.BUSINESS_NAME_ALREADY_EXISTS,
            };
        }
        if (result.status === CreateResultStatus.GENERIC_ERROR) {
            return {
                status: PhysicalBusinessCreatorResultStatus.GENERIC_ERROR,
            };
        }
        return {
            status: PhysicalBusinessCreatorResultStatus.OK,
            id: business.id,
        };
    }
}
