import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PageNumber, PageSize } from 'src/modules/shared/domain';
import {
    FilterOnlineBusinessesResult,
    OnlineBusinessReader,
    GetOnlineBusinessesQuery,
} from '.';

@QueryHandler(GetOnlineBusinessesQuery)
export class GetOnlineBusinessesQueryHandler
    implements IQueryHandler<GetOnlineBusinessesQuery>
{
    constructor(private onlineBusinessReader: OnlineBusinessReader) {}

    async execute(
        query: GetOnlineBusinessesQuery,
    ): Promise<FilterOnlineBusinessesResult> {
        const pageNumber = query.pageNumber
            ? PageNumber.createFrom(Number(query.pageNumber))
            : PageNumber.createMinPageNumber();
        const pageSize = query.pageSize
            ? PageSize.createFrom(Number(query.pageSize))
            : PageSize.createMaxPageSize();
        return await this.onlineBusinessReader.filter(
            pageNumber,
            pageSize,
            query.filter,
        );
    }
}
