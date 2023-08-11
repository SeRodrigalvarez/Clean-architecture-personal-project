import { Inject, Injectable, Logger } from '@nestjs/common';
import { BusinessEmail, Id } from 'src/modules/shared/domain';
import {
    CreateResultStatus,
    PhysicalBusiness,
    PhysicalBusinessAddress,
    PhysicalBusinessName,
    PhysicalBusinessPhone,
    PhysicalBusinessRepository,
    PHYSICAL_BUSINESS_PORT,
} from '../domain';

@Injectable()
export class PhysicalBusinessCreator {
    private readonly logger = new Logger(PhysicalBusinessCreator.name);

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
    ): Promise<void> {
        const business = PhysicalBusiness.createNew(
            id,
            name,
            address,
            phone,
            email,
        );
        const result = await this.repository.create(business);
        if (result.status === CreateResultStatus.BUSINESS_ALREADY_EXISTS) {
            if (result.isNameCollision) {
                this.logger.error(
                    `A physical business with name ${name.value} already exists`,
                );
            }
            if (result.isPhoneCollision) {
                this.logger.error(
                    `A physical business with phone ${phone.value} already exists`,
                );
            }
        }
        if (result.status === CreateResultStatus.GENERIC_ERROR) {
            this.logger.error(`Error at physical business repository level`);
        }
    }
}
