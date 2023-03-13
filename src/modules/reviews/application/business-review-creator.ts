import { Inject, Injectable } from '@nestjs/common';
import {
    OnlineBusinessRepository,
    ONLINE_BUSINESS_PORT,
} from 'src/modules/online-business/domain';
import { Id } from 'src/modules/shared/domain';
import {
    CreateResultStatus,
    Review,
    ReviewRating,
    ReviewRepository,
    ReviewText,
    REVIEW_REPOSITORY_PORT,
    Username,
} from '../domain';
import { GetResultStatus as GetOnlineResultStatus } from 'src/modules/online-business/domain';
import { GetResultStatus as GetPhysicalResultStatus } from 'src/modules/physical-business/domain';
import {
    PHYSICAL_BUSINESS_PORT,
    PhysicalBusinessRepository,
} from 'src/modules/physical-business/domain';

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
        private onlineBusinessRepository: OnlineBusinessRepository,
        @Inject(PHYSICAL_BUSINESS_PORT)
        private physicalBusinessRepository: PhysicalBusinessRepository,
    ) {}

    async execute(
        businessId: Id,
        text: ReviewText,
        rating: ReviewRating,
        username: Username,
    ): Promise<BusinessReviewCreatorResult> {
        const getOnlineResult = await this.onlineBusinessRepository.getById(
            businessId,
        );
        const getPhysicalResult = await this.physicalBusinessRepository.getById(
            businessId,
        );
        if (
            getOnlineResult.status === GetOnlineResultStatus.GENERIC_ERROR ||
            getPhysicalResult.status === GetPhysicalResultStatus.GENERIC_ERROR
        ) {
            return {
                status: BusinessReviewCreatorResultStatus.GENERIC_ERROR,
            };
        }
        if (
            getOnlineResult.status === GetOnlineResultStatus.NOT_FOUND &&
            getPhysicalResult.status === GetPhysicalResultStatus.NOT_FOUND
        ) {
            return {
                status: BusinessReviewCreatorResultStatus.NON_EXISTANT_BUSINESS_ID,
            };
        }
        const isOnline = getOnlineResult.status === GetOnlineResultStatus.OK;

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
        isOnline
            ? await this.onlineBusinessRepository.increaseReviewAmount(
                  businessId,
              )
            : await this.physicalBusinessRepository.increaseReviewAmount(
                  businessId,
              );
        return {
            status: BusinessReviewCreatorResultStatus.OK,
            id: review.id,
        };
    }
}
