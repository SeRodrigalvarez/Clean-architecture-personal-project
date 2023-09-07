import {
    GetPhysicalBusinessesQuery,
    GetPhysicalBusinessesQueryResponse,
    PhysicalBusinessReader,
} from '.';
import {
    PageNumber,
    PageSize,
    QUERY_BUS_PORT,
    QueryBus,
    QueryHandler,
} from 'src/modules/shared/domain';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetPhysicalBusinessesQueryHandler
    implements
        QueryHandler<
            GetPhysicalBusinessesQuery,
            GetPhysicalBusinessesQueryResponse
        >
{
    constructor(
        private physicalBusinessReader: PhysicalBusinessReader,
        @Inject(QUERY_BUS_PORT) private queryBus: QueryBus,
    ) {
        this.queryBus.addHanlder(GetPhysicalBusinessesQuery.QUERY_NAME, this);
    }

    async execute(
        query: GetPhysicalBusinessesQuery,
    ): Promise<GetPhysicalBusinessesQueryResponse> {
        const pageNumber = query.pageNumber
            ? PageNumber.createFrom(Number(query.pageNumber))
            : PageNumber.createMinPageNumber();
        const pageSize = query.pageSize
            ? PageSize.createFrom(Number(query.pageSize))
            : PageSize.createMaxPageSize();
        const result = await this.physicalBusinessReader.filter(
            pageNumber,
            pageSize,
            query.filter,
        );

        return new GetPhysicalBusinessesQueryResponse(
            result.status,
            result.physicalBusinesses,
        );
    }
}
