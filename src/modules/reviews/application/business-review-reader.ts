import { Inject, Injectable } from '@nestjs/common';
import { Id, PageSize, PageNumber } from 'src/modules/shared/domain';
import {
    GetResultStatus,
    Review,
    ReviewRepository,
    REVIEW_REPOSITORY_PORT,
} from '../domain';

export interface GetBusinessReviewByBusinessIdResult {
    status: BusinessReviewReaderResultStatus;
    reviews?: Review[];
}

export interface GetBusinessReviewByIdResult {
    status: BusinessReviewReaderResultStatus;
    review?: Review;
}

export enum BusinessReviewReaderResultStatus {
    OK,
    NOT_FOUND,
    GENERIC_ERROR,
}

@Injectable()
export class BusinessReviewReader {
    constructor(
        @Inject(REVIEW_REPOSITORY_PORT)
        private repository: ReviewRepository,
    ) {}

    async getByBusinessId(
        id: Id,
        pageNumber: PageNumber,
        pageSize: PageSize,
    ): Promise<GetBusinessReviewByBusinessIdResult> {
        const result = await this.repository.getByBusinessId(
            id,
            pageNumber,
            pageSize,
        );

        if (result.status === GetResultStatus.GENERIC_ERROR) {
            return {
                status: BusinessReviewReaderResultStatus.GENERIC_ERROR,
            };
        }
        if (result.status === GetResultStatus.NOT_FOUND) {
            return {
                status: BusinessReviewReaderResultStatus.NOT_FOUND,
            };
        }
        return {
            status: BusinessReviewReaderResultStatus.OK,
            reviews: result.reviews,
        };
    }

    async getById(id: Id): Promise<GetBusinessReviewByIdResult> {
        const result = await this.repository.getById(id);

        if (result.status === GetResultStatus.GENERIC_ERROR) {
            return {
                status: BusinessReviewReaderResultStatus.GENERIC_ERROR,
            };
        }
        if (result.status === GetResultStatus.NOT_FOUND) {
            return {
                status: BusinessReviewReaderResultStatus.NOT_FOUND,
            };
        }
        return {
            status: BusinessReviewReaderResultStatus.OK,
            review: result.review,
        };
    }
}
