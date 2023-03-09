import { Inject, Injectable } from '@nestjs/common';
import { Id } from 'src/modules/shared/domain';
import {
    GetResultStatus,
    PhysicalBusiness,
    PhysicalBusinessName,
    PhysicalBusinessRepository,
    PHYSICAL_BUSINESS_PORT,
} from '../domain';

export interface PhysicalBusinessReaderResult {
    status: PhysicalBusinessReaderResultStatus;
    physicalBusinesses?: PhysicalBusiness[];
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

    execute(
        id?: Id,
        name?: PhysicalBusinessName,
    ): PhysicalBusinessReaderResult {
        if (id) {
            const result = this.repository.getById(id);
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
                physicalBusinesses: [result.physicalBusiness],
            };
        }

        let result;
        if (name) {
            result = this.repository.getByName(name);
        } else {
            result = this.repository.getAll();
        }
        if (result.status === GetResultStatus.GENERIC_ERROR) {
            return {
                status: PhysicalBusinessReaderResultStatus.GENERIC_ERROR,
            };
        }
        if (result.status === GetResultStatus.OK) {
            return {
                status: PhysicalBusinessReaderResultStatus.OK,
                physicalBusinesses: result.physicalBusinesses,
            };
        }
        return {
            status: PhysicalBusinessReaderResultStatus.NOT_FOUND,
        };
    }
}
