import { Review } from '.';

export interface SaveResult {
    status: SaveResultStatus;
}

export enum SaveResultStatus {
    OK,
    DUPLICATED_REVIEW,
    GENERIC_ERROR,
}

export interface ReviewRepository {
    save(review: Review): Promise<SaveResult>;
}

export const REVIEW_REPOSITORY_PORT = Symbol('REVIEW_REPOSITORY_PORT');
