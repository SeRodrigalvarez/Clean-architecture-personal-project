import { Inject, Injectable, Logger } from '@nestjs/common';
import { BusinessEmail, Id } from 'src/modules/shared/domain';
import {
    PhysicalBusinessAddress,
    PhysicalBusinessName,
    PhysicalBusinessPhone,
    PHYSICAL_BUSINESS_VIEW_PORT,
    PhysicalBusinessViewRepository,
    PhysicalBusinessView,
    SaveViewResultStatus,
} from '../domain';

@Injectable()
export class PhysicalBusinessViewCreator {
    private readonly logger = new Logger(PhysicalBusinessViewCreator.name);

    constructor(
        @Inject(PHYSICAL_BUSINESS_VIEW_PORT)
        private repository: PhysicalBusinessViewRepository,
    ) {}

    async execute(
        id: Id,
        name: PhysicalBusinessName,
        address: PhysicalBusinessAddress,
        phone: PhysicalBusinessPhone,
        email: BusinessEmail,
    ): Promise<void> {
        const business = PhysicalBusinessView.createNew(
            id,
            name,
            address,
            phone,
            email,
        );
        const result = await this.repository.save(business);

        if (result.status === SaveViewResultStatus.GENERIC_ERROR) {
            this.logger.error(
                `Error at physical business view repository level`,
            );
        }
    }
}
