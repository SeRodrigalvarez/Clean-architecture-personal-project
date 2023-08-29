import { Id, PageSize, PageNumber } from 'src/modules/shared/domain';
import { OnlineBusinessView } from '.';

export interface SaveViewResult {
    status: SaveViewResultStatus;
    isNameCollision?: boolean;
    isWebsiteCollision?: boolean;
}

export enum SaveViewResultStatus {
    OK,
    BUSINESS_ALREADY_EXISTS,
    GENERIC_ERROR,
}

export interface GetSingleViewResult {
    status: GetViewResultStatus;
    onlineBusinessView?: OnlineBusinessView;
}

export interface GetViewResult {
    status: GetViewResultStatus;
    onlineBusinessViews?: OnlineBusinessView[];
}

export enum GetViewResultStatus {
    OK,
    NOT_FOUND,
    GENERIC_ERROR,
}

export interface OnlineBusinessViewRepository {
    save(onlineBusinessView: OnlineBusinessView): Promise<SaveViewResult>;
    getByNameOrWebsite(
        value: string,
        pageNumber: PageNumber,
        pageSize: PageSize,
    ): Promise<GetViewResult>;
    getById(id: Id): Promise<GetSingleViewResult>;
    getAll(pageNumber: PageNumber, pageSize: PageSize): Promise<GetViewResult>;
}

export const ONLINE_BUSINESS_VIEW_PORT = Symbol('ONLINE_BUSINESS_VIEW_PORT');
