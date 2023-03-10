import { Id } from 'src/modules/shared/domain';
import { Review } from '.';

export interface CreateResult {
    status: CreateResultStatus;
}

export enum CreateResultStatus {
    OK,
    DUPLICATED_REVIEW,
    GENERIC_ERROR,
}

export interface GetResult {
    status: GetResultStatus;
    reviews?: Review[];
}

export interface GetSingleResult {
    status: GetResultStatus;
    review?: Review;
}

export enum GetResultStatus {
    OK,
    NOT_FOUND,
    GENERIC_ERROR,
}

export interface ReviewRepository {
    create(review: Review): CreateResult;
    getByBusinessId(id: Id): GetResult;
    getById(id: Id): GetSingleResult;
}

export const REVIEW_REPOSITORY_PORT = Symbol('REVIEW_REPOSITORY_PORT');
