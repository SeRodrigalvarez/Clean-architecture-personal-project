import { Inject, Injectable } from '@nestjs/common';
import { Id } from 'src/modules/shared/domain';
import {
    GetResultStatus,
    Review,
    ReviewRepository,
    REVIEW_REPOSITORY_PORT,
} from '../domain';

export interface OnlineBusinessReviewReaderResult {
    status: OnlineBusinessReviewReaderResultStatus;
    reviews?: Review[];
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

    execute(id: Id): OnlineBusinessReviewReaderResult {
        const result = this.repository.getByBusinessId(id);

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
}
