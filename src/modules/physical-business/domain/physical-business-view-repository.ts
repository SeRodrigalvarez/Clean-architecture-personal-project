import { PhysicalBusinessView } from '.';
import { Id, PageSize, PageNumber } from 'src/modules/shared/domain';

export interface SaveViewResult {
    status: SaveViewResultStatus;
    isNameCollision?: boolean;
    isPhoneCollision?: boolean;
}

export enum SaveViewResultStatus {
    OK,
    GENERIC_ERROR,
}

export interface GetSingleViewResult {
    status: GetViewResultStatus;
    physicalBusinessView?: PhysicalBusinessView;
}

export interface GetViewResult {
    status: GetViewResultStatus;
    physicalBusinessViews?: PhysicalBusinessView[];
}

export enum GetViewResultStatus {
    OK,
    NOT_FOUND,
    GENERIC_ERROR,
}

export interface PhysicalBusinessViewRepository {
    save(physicalBusinessView: PhysicalBusinessView): Promise<SaveViewResult>;
    getByNameOrAddress(
        value: string,
        pageNumber: PageNumber,
        pageSize: PageSize,
    ): Promise<GetViewResult>;
    getById(id: Id): Promise<GetSingleViewResult>;
    getAll(pageNumber: PageNumber, pageSize: PageSize): Promise<GetViewResult>;
}

export const PHYSICAL_BUSINESS_VIEW_PORT = Symbol(
    'PHYSICAL_BUSINESS_VIEW_PORT',
);
