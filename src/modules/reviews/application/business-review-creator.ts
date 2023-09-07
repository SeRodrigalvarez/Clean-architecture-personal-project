import { Inject, Injectable } from '@nestjs/common';
import {
    ONLINE_BUSINESS_PORT,
    OnlineBusinessViewRepository,
} from 'src/modules/online-business/domain';
import { Id, ReviewRating } from 'src/modules/shared/domain';
import {
    CreateResultStatus,
    Review,
    ReviewRepository,
    ReviewText,
    REVIEW_REPOSITORY_PORT,
    Username,
} from '../domain';
import { GetViewResultStatus as GetOnlineViewResultStatus } from 'src/modules/online-business/domain';
import {
    GetViewResultStatus as GetPhysicaViewlResultStatus,
    PhysicalBusinessViewRepository,
} from 'src/modules/physical-business/domain';
import { PHYSICAL_BUSINESS_PORT } from 'src/modules/physical-business/domain';

export interface BusinessReviewCreatorResult {
    status: BusinessReviewCreatorResultStatus;
    id?: string;
}

export enum BusinessReviewCreatorResultStatus {
    OK,
    NON_EXISTANT_BUSINESS_ID,
    DUPLICATED_REVIEW,
    GENERIC_ERROR,
}

@Injectable()
export class BusinessReviewCreator {
    constructor(
        @Inject(REVIEW_REPOSITORY_PORT)
        private reviewRepository: ReviewRepository,
        @Inject(ONLINE_BUSINESS_PORT)
        private onlineBusinessViewRepository: OnlineBusinessViewRepository,
        @Inject(PHYSICAL_BUSINESS_PORT)
        private physicalBusinessViewRepository: PhysicalBusinessViewRepository,
    ) {}

    async execute(
        businessId: Id,
        text: ReviewText,
        rating: ReviewRating,
        username: Username,
    ): Promise<BusinessReviewCreatorResult> {
        const getOnlineResult = await this.onlineBusinessViewRepository.getById(
            businessId,
        );
        const getPhysicalResult =
            await this.physicalBusinessViewRepository.getById(businessId);
        if (
            getOnlineResult.status ===
                GetOnlineViewResultStatus.GENERIC_ERROR ||
            getPhysicalResult.status ===
                GetPhysicaViewlResultStatus.GENERIC_ERROR
        ) {
            return {
                status: BusinessReviewCreatorResultStatus.GENERIC_ERROR,
            };
        }
        if (
            getOnlineResult.status === GetOnlineViewResultStatus.NOT_FOUND &&
            getPhysicalResult.status === GetPhysicaViewlResultStatus.NOT_FOUND
        ) {
            return {
                status: BusinessReviewCreatorResultStatus.NON_EXISTANT_BUSINESS_ID,
            };
        }
        // TODO: Use ReviewCreatedEvent events
        //const isOnline = getOnlineResult.status === GetOnlineViewResultStatus.OK;

        const review = Review.createNew(businessId, text, rating, username);
        const createResult = await this.reviewRepository.create(review);
        if (createResult.status === CreateResultStatus.DUPLICATED_REVIEW) {
            return {
                status: BusinessReviewCreatorResultStatus.DUPLICATED_REVIEW,
            };
        }
        if (createResult.status === CreateResultStatus.GENERIC_ERROR) {
            return {
                status: BusinessReviewCreatorResultStatus.GENERIC_ERROR,
            };
        }
        // TODO: Use ReviewCreatedEvent events
        /*isOnline
            ? await this.onlineBusinessViewRepository.increaseReviewAmount(
                  businessId,
              )
            : await this.physicalBusinessRepository.increaseReviewAmount(
                  businessId,
              );*/
        return {
            status: BusinessReviewCreatorResultStatus.OK,
            id: review.id,
        };
    }
}
