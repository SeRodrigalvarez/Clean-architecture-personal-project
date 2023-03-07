import { Inject, Injectable } from "@nestjs/common";
import { BusinessId } from "src/modules/shared/domain";
import { GetResultStatus, OnlineBusiness, OnlineBusinessName, OnlineBusinessRepository, ONLINE_BUSINESS_PORT } from "../domain";


export interface OnlineBusinessReaderResult {
    status: OnlineBusinessReaderResultStatus
    onlineBusinesses?: OnlineBusiness[]
}

export enum OnlineBusinessReaderResultStatus {
    OK,
    NOT_FOUND
}

@Injectable()
export class OnlineBusinessReader {
    constructor(
        @Inject(ONLINE_BUSINESS_PORT)
        private repository: OnlineBusinessRepository,
    ) {}

    execute(
        id?: BusinessId,
        name?: OnlineBusinessName
    ): OnlineBusinessReaderResult {
        if (id) {
            const result = this.repository.getById(id);
            if (result.status === GetResultStatus.OK) {
                return {
                    status: OnlineBusinessReaderResultStatus.OK,
                    onlineBusinesses: [result.onlineBusiness]
                }
            }
            return {
                status: OnlineBusinessReaderResultStatus.NOT_FOUND
            }
        }

        let result
        if (name) {
            result = this.repository.getByName(name);
        } else {
            result = this.repository.getAll()
        }
        if (result.status === GetResultStatus.OK) {
            return {
                status: OnlineBusinessReaderResultStatus.OK,
                onlineBusinesses: result.onlineBusinesses
            }
        }
        return {
            status: OnlineBusinessReaderResultStatus.NOT_FOUND
        }
    }
}