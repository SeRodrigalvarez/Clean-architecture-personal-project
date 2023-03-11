import { Inject, Injectable } from '@nestjs/common';
import { Id, PageSize, PageNumber } from 'src/modules/shared/domain';
import {
    GetResultStatus,
    PhysicalBusiness,
    PhysicalBusinessRepository,
    PHYSICAL_BUSINESS_PORT,
} from '../domain';

export interface FilterPhysicalBusinessesResult {
    status: PhysicalBusinessReaderResultStatus;
    physicalBusinesses?: PhysicalBusiness[];
}

export interface GetPhysicalBusinessByIdResult {
    status: PhysicalBusinessReaderResultStatus;
    physicalBusiness?: PhysicalBusiness;
}

export enum PhysicalBusinessReaderResultStatus {
    OK,
    NOT_FOUND,
    GENERIC_ERROR,
}

@Injectable()
export class PhysicalBusinessReader {
    constructor(
        @Inject(PHYSICAL_BUSINESS_PORT)
        private repository: PhysicalBusinessRepository,
    ) {}

    async filter(
        pageNumber: PageNumber,
        pageSize: PageSize,
        value?: string,
    ): Promise<FilterPhysicalBusinessesResult> {
        let result;
        if (value) {
            result = this.repository.getByNameOrAddress(
                value,
                pageNumber,
                pageSize,
            );
        } else {
            result = await this.repository.getAll(pageNumber, pageSize);
        }
        if (result.status === GetResultStatus.GENERIC_ERROR) {
            return {
                status: PhysicalBusinessReaderResultStatus.GENERIC_ERROR,
            };
        }
        if (result.status === GetResultStatus.NOT_FOUND) {
            return {
                status: PhysicalBusinessReaderResultStatus.NOT_FOUND,
            };
        }
        return {
            status: PhysicalBusinessReaderResultStatus.OK,
            physicalBusinesses: result.physicalBusinesses,
        };
    }

    async getById(id: Id): Promise<GetPhysicalBusinessByIdResult> {
        const result = await this.repository.getById(id);

        if (result.status === GetResultStatus.GENERIC_ERROR) {
            return {
                status: PhysicalBusinessReaderResultStatus.GENERIC_ERROR,
            };
        }

        if (result.status === GetResultStatus.NOT_FOUND) {
            return {
                status: PhysicalBusinessReaderResultStatus.NOT_FOUND,
            };
        }

        return {
            status: PhysicalBusinessReaderResultStatus.OK,
            physicalBusiness: result.physicalBusiness,
        };
    }
}
