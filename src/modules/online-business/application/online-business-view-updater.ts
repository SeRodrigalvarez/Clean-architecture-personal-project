import { Inject, Injectable, Logger } from '@nestjs/common';
import {
    GetViewResultStatus,
    ONLINE_BUSINESS_VIEW_PORT,
    OnlineBusinessViewRepository,
    SaveViewResultStatus,
} from '../domain';
import { BusinessAverageRating, Id } from 'src/modules/shared/domain';

@Injectable()
export class OnlineBusinessViewUpdater {
    private readonly logger = new Logger(OnlineBusinessViewUpdater.name);

    constructor(
        @Inject(ONLINE_BUSINESS_VIEW_PORT)
        private repository: OnlineBusinessViewRepository,
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

        const business = getBusinessResult.onlineBusinessView;
        business.setAverageRating(averageRating);
        business.increaseReviewAmount();
        const saveBusinessResult = await this.repository.save(business);

        if (saveBusinessResult.status === SaveViewResultStatus.GENERIC_ERROR) {
            this.logger.error(`Error at online business view repository level`);
        }
    }
}
