import { Inject, Injectable } from '@nestjs/common';
import { Id } from 'src/modules/shared/domain';
import {
    GetResultStatus,
    Review,
    ReviewRepository,
    REVIEW_REPOSITORY_PORT,
} from '../domain';

export interface PhysicalBusinessReviewReaderResult {
    status: PhysicalBusinessReviewReaderResultStatus;
    reviews?: Review[];
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

    execute(id: Id): PhysicalBusinessReviewReaderResult {
        const result = this.repository.getByBusinessId(id);

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
}
