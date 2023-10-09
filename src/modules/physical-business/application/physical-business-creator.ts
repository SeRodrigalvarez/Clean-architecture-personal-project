import { Inject, Injectable } from '@nestjs/common';
import { BusinessEmail, Id } from 'src/modules/shared/domain';
import {
    PhysicalBusiness,
    PhysicalBusinessAddress,
    PhysicalBusinessName,
    PhysicalBusinessPhone,
    PhysicalBusinessRepository,
    PHYSICAL_BUSINESS_PORT,
    SaveResult,
} from '../domain';

@Injectable()
export class PhysicalBusinessCreator {
    constructor(
        @Inject(PHYSICAL_BUSINESS_PORT)
        private repository: PhysicalBusinessRepository,
    ) {}

    async execute(
        id: Id,
        name: PhysicalBusinessName,
        address: PhysicalBusinessAddress,
        phone: PhysicalBusinessPhone,
        email: BusinessEmail,
    ): Promise<SaveResult> {
        const business = PhysicalBusiness.createNew(
            id,
            name,
            address,
            phone,
            email,
        );
        return this.repository.save(business);
    }
}
