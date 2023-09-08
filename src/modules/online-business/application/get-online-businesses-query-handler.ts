import {
    PageNumber,
    PageSize,
    QUERY_BUS_PORT,
    QueryBus,
    QueryHandler,
} from 'src/modules/shared/domain';
import {
    GetOnlineBusinessesQuery,
    GetOnlineBusinessesQueryResponse,
    OnlineBusinessReader,
} from '.';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetOnlineBusinessesQueryHandler
    implements
        QueryHandler<
            GetOnlineBusinessesQuery,
            GetOnlineBusinessesQueryResponse
        >
{
    constructor(
        private onlineBusinessReader: OnlineBusinessReader,
        @Inject(QUERY_BUS_PORT) private queryBus: QueryBus,
    ) {
        this.queryBus.addHanlder(GetOnlineBusinessesQuery.name, this);
    }

    async execute(
        query: GetOnlineBusinessesQuery,
    ): Promise<GetOnlineBusinessesQueryResponse> {
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

        return new GetOnlineBusinessesQueryResponse(
            result.status,
            result.onlineBusinesses,
        );
    }
}
