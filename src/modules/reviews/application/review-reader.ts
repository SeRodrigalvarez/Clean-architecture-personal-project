import { Inject, Injectable } from '@nestjs/common';
import { Id, PageSize, PageNumber } from 'src/modules/shared/domain';
import {
    REVIEW_REPOSITORY_VIEW_PORT,
    ReviewViewRepository,
    GetViewResultStatus,
} from '../domain';

export interface ReaderReview {
    id: string;
    businessId: string;
    text: string;
    rating: number;
    username: string;
}

export interface GetReviewByBusinessIdResult {
    status: GetViewResultStatus;
    reviewViews?: ReaderReview[];
}

export interface GetReviewByIdResult {
    status: GetViewResultStatus;
    reviewView?: ReaderReview;
}

@Injectable()
export class ReviewReader {
    constructor(
        @Inject(REVIEW_REPOSITORY_VIEW_PORT)
        private reviewViewRepository: ReviewViewRepository,
    ) {}

    async getByBusinessId(
        id: Id,
        pageNumber: PageNumber,
        pageSize: PageSize,
    ): Promise<GetReviewByBusinessIdResult> {
        const result = await this.reviewViewRepository.getByBusinessId(
            id,
            pageNumber,
            pageSize,
        );
        return {
            status: result.status,
            reviewViews: result.reviewViews?.map((reviewView) =>
                reviewView.toPrimitives(),
            ),
        };
    }

    async getById(id: Id): Promise<GetReviewByIdResult> {
        const result = await this.reviewViewRepository.getById(id);
        return {
            status: result.status,
            reviewView: result.reviewView?.toPrimitives(),
        };
    }

    getAverageRatingByBusinessId(id: Id): Promise<number> {
        return this.reviewViewRepository.getAverageRatingByBusinessId(id);
    }
}
