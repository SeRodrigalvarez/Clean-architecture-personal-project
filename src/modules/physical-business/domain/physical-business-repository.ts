import { PhysicalBusiness } from './';
import { Id, PageSize, PageNumber } from 'src/modules/shared/domain';

export interface CreateResult {
    status: CreateResultStatus;
    isNameCollision?: boolean;
    isPhoneCollision?: boolean;
}

export enum CreateResultStatus {
    OK,
    BUSINESS_ALREADY_EXISTS,
    GENERIC_ERROR,
}

export interface GetSingleResult {
    status: GetResultStatus;
    physicalBusiness?: PhysicalBusiness;
}

export interface GetResult {
    status: GetResultStatus;
    physicalBusinesses?: PhysicalBusiness[];
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

export interface PhysicalBusinessRepository {
    create(physicalBusiness: PhysicalBusiness): Promise<CreateResult>;
    getByNameOrAddress(
        value: string,
        pageNumber: PageNumber,
        pageSize: PageSize,
    ): Promise<GetResult>;
    getById(id: Id): Promise<GetSingleResult>;
    getAll(pageNumber: PageNumber, pageSize: PageSize): Promise<GetResult>;
    increaseReviewAmount(id: Id): Promise<UpdateResult>;
}

export const PHYSICAL_BUSINESS_PORT = Symbol('PHYSICAL_BUSINESS_PORT');
