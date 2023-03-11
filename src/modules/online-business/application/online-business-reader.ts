import { Inject, Injectable } from '@nestjs/common';
import { Id, PageSize, PageNumber } from 'src/modules/shared/domain';
import {
    GetResult,
    GetResultStatus,
    OnlineBusiness,
    OnlineBusinessRepository,
    ONLINE_BUSINESS_PORT,
} from '../domain';

export interface FilterOnlineBusinessesResult {
    status: OnlineBusinessReaderResultStatus;
    onlineBusinesses?: OnlineBusiness[];
}

export interface GetOnlineBusinessByIdResult {
    status: OnlineBusinessReaderResultStatus;
    onlineBusiness?: OnlineBusiness;
}

export enum OnlineBusinessReaderResultStatus {
    OK,
    NOT_FOUND,
    GENERIC_ERROR,
}

@Injectable()
export class OnlineBusinessReader {
    constructor(
        @Inject(ONLINE_BUSINESS_PORT)
        private repository: OnlineBusinessRepository,
    ) {}

    async filter(
        pageNumber: PageNumber,
        pageSize: PageSize,
        value?: string,
    ): Promise<FilterOnlineBusinessesResult> {
        let result: GetResult;
        if (value) {
            result = await this.repository.getByNameOrWebsite(
                value,
                pageNumber,
                pageSize,
            );
        } else {
            result = await this.repository.getAll(pageNumber, pageSize);
        }
        if (result.status === GetResultStatus.GENERIC_ERROR) {
            return {
                status: OnlineBusinessReaderResultStatus.GENERIC_ERROR,
            };
        }
        if (result.status === GetResultStatus.NOT_FOUND) {
            return {
                status: OnlineBusinessReaderResultStatus.NOT_FOUND,
            };
        }
        return {
            status: OnlineBusinessReaderResultStatus.OK,
            onlineBusinesses: result.onlineBusinesses,
        };
    }

    async getById(id: Id): Promise<GetOnlineBusinessByIdResult> {
        const result = await this.repository.getById(id);

        if (result.status === GetResultStatus.GENERIC_ERROR) {
            return {
                status: OnlineBusinessReaderResultStatus.GENERIC_ERROR,
            };
        }

        if (result.status === GetResultStatus.NOT_FOUND) {
            return {
                status: OnlineBusinessReaderResultStatus.NOT_FOUND,
            };
        }

        return {
            status: OnlineBusinessReaderResultStatus.OK,
            onlineBusiness: result.onlineBusiness,
        };
    }
}
