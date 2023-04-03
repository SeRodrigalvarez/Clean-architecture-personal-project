import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOnlineBusinessesQuery } from './get-online-businesses-query';
import { OnlineBusiness } from '../domain';
import { PageNumber, PageSize } from 'src/modules/shared/domain';
import { OnlineBusinessReader, OnlineBusinessReaderResultStatus } from '.';

export interface GetOnlineBusinessesQueryResult {
    status: GetOnlineBusinessesQueryResultStatus;
    onlineBusinesses?: OnlineBusiness[];
}

export enum GetOnlineBusinessesQueryResultStatus {
    OK,
    NOT_FOUND,
    GENERIC_ERROR,
}

@QueryHandler(GetOnlineBusinessesQuery)
export class GetOnlineBusinessesQueryHandler
    implements IQueryHandler<GetOnlineBusinessesQuery>
{
    constructor(private onlineBusinessReader: OnlineBusinessReader) {}

    async execute(
        query: GetOnlineBusinessesQuery,
    ): Promise<GetOnlineBusinessesQueryResult> {
        const pageNumber = query.pageNumber
            ? PageNumber.createFrom(Number(query.pageNumber))
            : PageNumber.createMinPageNumber();
        const pageSize = query.pageSize
            ? PageSize.createFrom(Number(query.pageSize))
            : PageSize.createMaxPageSize();
        const result = await this.onlineBusinessReader.filter(
            pageNumber,
            pageSize,
            query.filter,
        );

        if (result.status === OnlineBusinessReaderResultStatus.GENERIC_ERROR) {
            return {
                status: GetOnlineBusinessesQueryResultStatus.GENERIC_ERROR,
            };
        }

        if (result.status === OnlineBusinessReaderResultStatus.NOT_FOUND) {
            return {
                status: GetOnlineBusinessesQueryResultStatus.NOT_FOUND,
            };
        }

        return {
            status: GetOnlineBusinessesQueryResultStatus.OK,
            onlineBusinesses: result.onlineBusinesses,
        };
    }
}
