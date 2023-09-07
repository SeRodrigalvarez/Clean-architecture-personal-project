import { PhysicalBusiness } from '.';

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

export interface PhysicalBusinessRepository {
    save(physicalBusiness: PhysicalBusiness): Promise<SaveResult>;
}

export const PHYSICAL_BUSINESS_PORT = Symbol('PHYSICAL_BUSINESS_PORT');
