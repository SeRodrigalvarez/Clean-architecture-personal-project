import { Inject, Injectable } from '@nestjs/common';
import { Id, PageSize, PageNumber } from 'src/modules/shared/domain';
import {
    GetResultStatus,
    Review,
    ReviewRepository,
    REVIEW_REPOSITORY_PORT,
} from '../domain';

export interface GetPhysicalBusinessReviewByBusinessIdResult {
    status: PhysicalBusinessReviewReaderResultStatus;
    reviews?: Review[];
}

export interface GetPhysicalBusinessReviewByIdResult {
    status: PhysicalBusinessReviewReaderResultStatus;
    review?: Review;
}

export enum PhysicalBusinessReviewReaderResultStatus {
    OK,
    NOT_FOUND,
    GENERIC_ERROR,
}

@Injectable()
export class PhysicalBusinessReviewReader {
    constructor(
        @Inject(REVIEW_REPOSITORY_PORT)
        private repository: ReviewRepository,
    ) {}

    getByBusinessId(
        id: Id,
        pageNumber: PageNumber,
        pageSize: PageSize,
    ): GetPhysicalBusinessReviewByBusinessIdResult {
        const result = this.repository.getByBusinessId(
            id,
            pageNumber,
            pageSize,
        );

        if (result.status === GetResultStatus.GENERIC_ERROR) {
            return {
                status: PhysicalBusinessReviewReaderResultStatus.GENERIC_ERROR,
            };
        }
        if (result.status === GetResultStatus.NOT_FOUND) {
            return {
                status: PhysicalBusinessReviewReaderResultStatus.NOT_FOUND,
            };
        }
        return {
            status: PhysicalBusinessReviewReaderResultStatus.OK,
            reviews: result.reviews,
        };
    }

    getById(id: Id): GetPhysicalBusinessReviewByIdResult {
        const result = this.repository.getById(id);

        if (result.status === GetResultStatus.GENERIC_ERROR) {
            return {
                status: PhysicalBusinessReviewReaderResultStatus.GENERIC_ERROR,
            };
        }
        if (result.status === GetResultStatus.NOT_FOUND) {
            return {
                status: PhysicalBusinessReviewReaderResultStatus.NOT_FOUND,
            };
        }
        return {
            status: PhysicalBusinessReviewReaderResultStatus.OK,
            review: result.review,
        };
    }
}
