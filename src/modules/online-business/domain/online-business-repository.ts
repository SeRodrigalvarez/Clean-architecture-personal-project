import { OnlineBusiness, OnlineBusinessName } from './';
import { BusinessId } from 'src/modules/shared/domain';

export interface CreateResult {
    status: CreateResultStatus;
}

export enum CreateResultStatus {
    OK,
    BUSINESS_NAME_ALREADY_EXISTS,
    GENERIC_ERROR
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
    GENERIC_ERROR
}

export interface OnlineBusinessRepository {
    create(onlineBusiness: OnlineBusiness): CreateResult;
    getByName(name: OnlineBusinessName): GetResult;
    getById(id: BusinessId): GetSingleResult;
    getAll(): GetResult;
}

export const ONLINE_BUSINESS_PORT = Symbol('ONLINE_BUSINESS_PORT');
