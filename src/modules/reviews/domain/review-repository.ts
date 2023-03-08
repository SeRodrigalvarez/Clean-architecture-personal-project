import { BusinessId } from 'src/modules/shared/domain';
import { Review } from '.';

export interface GetResult {
    status: GetResultStatus;
    reviews?: Review[];
}

export enum GetResultStatus {
    OK,
    NOT_FOUND,
    GENERIC_ERROR,
}

export interface ReviewRepository {
    create(review: Review): void;
    getByBusinessId(id: BusinessId): GetResult;
}

export const REVIEW_REPOSITORY_PORT = Symbol('REVIEW_REPOSITORY_PORT');
