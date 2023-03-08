import { Get, Inject, Injectable } from '@nestjs/common';
import { Id } from 'src/modules/shared/domain';
import {
    GetResultStatus,
    OnlineBusiness,
    OnlineBusinessName,
    OnlineBusinessRepository,
    ONLINE_BUSINESS_PORT,
} from '../domain';

export interface OnlineBusinessReaderResult {
    status: OnlineBusinessReaderResultStatus;
    onlineBusinesses?: OnlineBusiness[];
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

    execute(id?: Id, name?: OnlineBusinessName): OnlineBusinessReaderResult {
        if (id) {
            const result = this.repository.getById(id);
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
                onlineBusinesses: [result.onlineBusiness],
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
                status: OnlineBusinessReaderResultStatus.GENERIC_ERROR,
            };
        }
        if (result.status === GetResultStatus.OK) {
            return {
                status: OnlineBusinessReaderResultStatus.OK,
                onlineBusinesses: result.onlineBusinesses,
            };
        }
        return {
            status: OnlineBusinessReaderResultStatus.NOT_FOUND,
        };
    }
}
