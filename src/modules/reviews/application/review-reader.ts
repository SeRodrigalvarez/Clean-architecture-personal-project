import { Inject, Injectable } from '@nestjs/common';
import { Id } from 'src/modules/shared/domain';
import {
    GetResultStatus,
    Review,
    ReviewRepository,
    REVIEW_REPOSITORY_PORT,
} from '../domain';

export interface ReviewReaderResult {
    status: ReviewReaderResultStatus;
    reviews?: Review[];
}

export enum ReviewReaderResultStatus {
    OK,
    NOT_FOUND,
    GENERIC_ERROR,
}

@Injectable()
export class ReviewReader {
    constructor(
        @Inject(REVIEW_REPOSITORY_PORT)
        private repository: ReviewRepository,
    ) {}

    execute(id: Id): ReviewReaderResult {
        const result = this.repository.getByBusinessId(id);

        if (result.status === GetResultStatus.GENERIC_ERROR) {
            return {
                status: ReviewReaderResultStatus.GENERIC_ERROR,
            };
        }
        if (result.status === GetResultStatus.NOT_FOUND) {
            return {
                status: ReviewReaderResultStatus.NOT_FOUND,
            };
        }
        return {
            status: ReviewReaderResultStatus.OK,
            reviews: result.reviews,
        };
    }
}
