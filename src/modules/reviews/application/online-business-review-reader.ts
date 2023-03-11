import { Inject, Injectable } from '@nestjs/common';
import { Id, PageSize, PageNumber } from 'src/modules/shared/domain';
import {
    GetResultStatus,
    Review,
    ReviewRepository,
    REVIEW_REPOSITORY_PORT,
} from '../domain';

export interface GetOnlineBusinessReviewByBusinessIdResult {
    status: OnlineBusinessReviewReaderResultStatus;
    reviews?: Review[];
}

export interface GetOnlineBusinessReviewByIdResult {
    status: OnlineBusinessReviewReaderResultStatus;
    review?: Review;
}

export enum OnlineBusinessReviewReaderResultStatus {
    OK,
    NOT_FOUND,
    GENERIC_ERROR,
}

@Injectable()
export class OnlineBusinessReviewReader {
    constructor(
        @Inject(REVIEW_REPOSITORY_PORT)
        private repository: ReviewRepository,
    ) {}

    async getByBusinessId(
        id: Id,
        pageNumber: PageNumber,
        pageSize: PageSize,
    ): Promise<GetOnlineBusinessReviewByBusinessIdResult> {
        const result = await this.repository.getByBusinessId(
            id,
            pageNumber,
            pageSize,
        );

        if (result.status === GetResultStatus.GENERIC_ERROR) {
            return {
                status: OnlineBusinessReviewReaderResultStatus.GENERIC_ERROR,
            };
        }
        if (result.status === GetResultStatus.NOT_FOUND) {
            return {
                status: OnlineBusinessReviewReaderResultStatus.NOT_FOUND,
            };
        }
        return {
            status: OnlineBusinessReviewReaderResultStatus.OK,
            reviews: result.reviews,
        };
    }

    async getById(id: Id): Promise<GetOnlineBusinessReviewByIdResult> {
        const result = await this.repository.getById(id);

        if (result.status === GetResultStatus.GENERIC_ERROR) {
            return {
                status: OnlineBusinessReviewReaderResultStatus.GENERIC_ERROR,
            };
        }
        if (result.status === GetResultStatus.NOT_FOUND) {
            return {
                status: OnlineBusinessReviewReaderResultStatus.NOT_FOUND,
            };
        }
        return {
            status: OnlineBusinessReviewReaderResultStatus.OK,
            review: result.review,
        };
    }
}
