import { Inject, Injectable } from '@nestjs/common';
import {
    PhysicalBusinessRepository,
    PHYSICAL_BUSINESS_PORT,
} from 'src/modules/physical-business/domain';
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
import { GetResultStatus } from 'src/modules/physical-business/domain';

export interface PhysicalBusinessReviewCreatorResult {
    status: PhysicalBusinessReviewCreatorResultStatus;
}

export enum PhysicalBusinessReviewCreatorResultStatus {
    OK,
    NON_EXISTANT_BUSINESS_ID,
    DUPLICATED_REVIEW,
    GENERIC_ERROR,
}

@Injectable()
export class PhysicalBusinessReviewCreator {
    constructor(
        @Inject(REVIEW_REPOSITORY_PORT)
        private reviewRepository: ReviewRepository,
        @Inject(PHYSICAL_BUSINESS_PORT)
        private physicalBusinessRepository: PhysicalBusinessRepository,
    ) {}

    execute(
        businessId: Id,
        text: ReviewText,
        rating: ReviewRating,
        username: Username,
    ): PhysicalBusinessReviewCreatorResult {
        const getResult = this.physicalBusinessRepository.getById(businessId);
        if (getResult.status === GetResultStatus.GENERIC_ERROR) {
            return {
                status: PhysicalBusinessReviewCreatorResultStatus.GENERIC_ERROR,
            };
        }
        if (getResult.status === GetResultStatus.NOT_FOUND) {
            return {
                status: PhysicalBusinessReviewCreatorResultStatus.NON_EXISTANT_BUSINESS_ID,
            };
        }
        const createResult = this.reviewRepository.create(
            new Review(businessId, text, rating, username),
        );
        if (createResult.status === CreateResultStatus.DUPLICATED_REVIEW) {
            return {
                status: PhysicalBusinessReviewCreatorResultStatus.DUPLICATED_REVIEW,
            };
        }
        if (createResult.status === CreateResultStatus.GENERIC_ERROR) {
            return {
                status: PhysicalBusinessReviewCreatorResultStatus.GENERIC_ERROR,
            };
        }
        this.physicalBusinessRepository.increaseReviewAmount(businessId);
        return {
            status: PhysicalBusinessReviewCreatorResultStatus.OK,
        };
    }
}
