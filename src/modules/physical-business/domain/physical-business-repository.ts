import { PhysicalBusiness } from './';
import { Id, PageSize, PageNumber } from 'src/modules/shared/domain';

export interface SaveResult {
    status: SaveResultStatus;
    isNameCollision?: boolean;
    isPhoneCollision?: boolean;
}

export enum SaveResultStatus {
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
    save(physicalBusiness: PhysicalBusiness): Promise<SaveResult>;
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
