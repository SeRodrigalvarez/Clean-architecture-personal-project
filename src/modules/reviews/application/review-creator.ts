import { Inject, Injectable } from '@nestjs/common';
import {
    OnlineBusinessRepository,
    ONLINE_BUSINESS_PORT,
} from 'src/modules/online-business/domain';
import { Id } from 'src/modules/shared/domain';
import {
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
        const result = this.onlineBusiness.getById(businessId);
        if (result.status === GetResultStatus.GENERIC_ERROR) {
            return {
                status: ReviewCreatorResultStatus.GENERIC_ERROR,
            };
        }
        if (result.status === GetResultStatus.NOT_FOUND) {
            return {
                status: ReviewCreatorResultStatus.NON_EXISTANT_BUSINESS_ID,
            };
        }
        this.reviewRepository.create(
            new Review(businessId, text, rating, username),
        );
        return {
            status: ReviewCreatorResultStatus.OK,
        };
    }
}
