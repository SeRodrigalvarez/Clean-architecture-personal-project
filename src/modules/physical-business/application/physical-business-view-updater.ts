import { Inject, Injectable, Logger } from '@nestjs/common';
import {
    GetViewResultStatus,
    PHYSICAL_BUSINESS_VIEW_PORT,
    PhysicalBusinessViewRepository,
    SaveViewResultStatus,
} from '../domain';
import { BusinessAverageRating, Id } from 'src/modules/shared/domain';

@Injectable()
export class PhysicalBusinessViewUpdater {
    private readonly logger = new Logger(PhysicalBusinessViewUpdater.name);

    constructor(
        @Inject(PHYSICAL_BUSINESS_VIEW_PORT)
        private repository: PhysicalBusinessViewRepository,
    ) {}

    async updateRatingData(id: Id, averageRating: BusinessAverageRating) {
        const getBusinessResult = await this.repository.getById(id);

        if (getBusinessResult.status === GetViewResultStatus.GENERIC_ERROR) {
            this.logger.error(`Error at online business view repository level`);
            return;
        }

        if (getBusinessResult.status === GetViewResultStatus.NOT_FOUND) {
            return;
        }

        const business = getBusinessResult.physicalBusinessView;
        business.setAverageRating(averageRating);
        business.increaseReviewsAmount();
        const saveBusinessResult = await this.repository.save(business);

        if (saveBusinessResult.status === SaveViewResultStatus.GENERIC_ERROR) {
            this.logger.error(`Error at online business view repository level`);
        }
    }
}
