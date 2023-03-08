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
import { GetResultStatus } from 'src/modules/online-business/domain';

export interface ReviewCreatorResult {
    status: ReviewCreatorResultStatus;
}

export enum ReviewCreatorResultStatus {
    OK,
    NON_EXISTANT_BUSINESS_ID,
    DUPLICATED_REVIEW,
    GENERIC_ERROR,
}

@Injectable()
export class ReviewCreator {
    constructor(
        @Inject(REVIEW_REPOSITORY_PORT)
        private reviewRepository: ReviewRepository,
        @Inject(ONLINE_BUSINESS_PORT)
        private onlineBusiness: OnlineBusinessRepository,
    ) {}

    execute(
        businessId: Id,
        text: ReviewText,
        rating: ReviewRating,
        username: Username,
    ): ReviewCreatorResult {
        const getResult = this.onlineBusiness.getById(businessId);
        if (getResult.status === GetResultStatus.GENERIC_ERROR) {
            return {
                status: ReviewCreatorResultStatus.GENERIC_ERROR,
            };
        }
        if (getResult.status === GetResultStatus.NOT_FOUND) {
            return {
                status: ReviewCreatorResultStatus.NON_EXISTANT_BUSINESS_ID,
            };
        }
        const result = this.reviewRepository.create(
            new Review(businessId, text, rating, username),
        );
        if (result.status === CreateResultStatus.DUPLICATED_REVIEW) {
            return {
                status: ReviewCreatorResultStatus.DUPLICATED_REVIEW,
            };
        }
        if (result.status === CreateResultStatus.GENERIC_ERROR) {
            return {
                status: ReviewCreatorResultStatus.GENERIC_ERROR,
            };
        }
        return {
            status: ReviewCreatorResultStatus.OK,
        };
    }
}
