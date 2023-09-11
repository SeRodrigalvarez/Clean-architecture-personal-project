import { Id, PageSize, PageNumber } from 'src/modules/shared/domain';
import { ReviewView } from '.';

export interface SaveViewResult {
    status: SaveViewResultStatus;
}

export enum SaveViewResultStatus {
    OK,
    GENERIC_ERROR,
}

export interface GetViewResult {
    status: GetViewResultStatus;
    reviewViews?: ReviewView[];
}

export interface GetSingleViewResult {
    status: GetViewResultStatus;
    reviewView?: ReviewView;
}

export enum GetViewResultStatus {
    OK,
    NOT_FOUND,
    GENERIC_ERROR,
}

export interface ReviewViewRepository {
    save(reviewView: ReviewView): Promise<SaveViewResult>;
    getByBusinessId(
        id: Id,
        pageNumber: PageNumber,
        pageSize: PageSize,
    ): Promise<GetViewResult>;
    getById(id: Id): Promise<GetSingleViewResult>;
    getAverageRatingByBusinessId(id: Id): Promise<number>;
}

export const REVIEW_REPOSITORY_VIEW_PORT = Symbol(
    'REVIEW_REPOSITORY_VIEW_PORT',
);
