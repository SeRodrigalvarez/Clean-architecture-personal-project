import { OnlineBusiness } from './';
import { Id, PageSize, PageNumber } from 'src/modules/shared/domain';

export interface CreateResult {
    status: CreateResultStatus;
}

export enum CreateResultStatus {
    OK,
    BUSINESS_NAME_ALREADY_EXISTS,
    GENERIC_ERROR,
}

export interface GetSingleResult {
    status: GetResultStatus;
    onlineBusiness?: OnlineBusiness;
}

export interface GetResult {
    status: GetResultStatus;
    onlineBusinesses?: OnlineBusiness[];
}

export enum GetResultStatus {
    OK,
    NOT_FOUND,
    GENERIC_ERROR,
}

export interface UpdateResult {
    status: UpdateResultStatus;
}

export enum UpdateResultStatus {
    OK,
    NOT_FOUND,
    GENERIC_ERROR,
}

export interface OnlineBusinessRepository {
    create(onlineBusiness: OnlineBusiness): Promise<CreateResult>;
    getByNameOrWebsite(
        value: string,
        pageNumber: PageNumber,
        pageSize: PageSize,
    ): Promise<GetResult>;
    getById(id: Id): Promise<GetSingleResult>;
    getAll(pageNumber: PageNumber, pageSize: PageSize): Promise<GetResult>;
    increaseReviewAmount(id: Id): Promise<UpdateResult>;
}

export const ONLINE_BUSINESS_PORT = Symbol('ONLINE_BUSINESS_PORT');
