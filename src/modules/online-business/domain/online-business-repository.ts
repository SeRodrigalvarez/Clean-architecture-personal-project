import { OnlineBusiness } from '.';

export interface SaveResult {
    status: SaveResultStatus;
    isNameCollision?: boolean;
    isWebsiteCollision?: boolean;
}

export enum SaveResultStatus {
    OK,
    BUSINESS_ALREADY_EXISTS,
    GENERIC_ERROR,
}

export interface OnlineBusinessRepository {
    save(onlineBusiness: OnlineBusiness): Promise<SaveResult>;
}

export const ONLINE_BUSINESS_PORT = Symbol('ONLINE_BUSINESS_PORT');
