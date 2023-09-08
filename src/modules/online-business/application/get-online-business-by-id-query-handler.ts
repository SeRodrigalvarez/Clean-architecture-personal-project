import { Inject } from '@nestjs/common';
import {
    GetOnlineBusinessByIdQuery,
    GetOnlineBusinessByIdQueryResponse,
    OnlineBusinessReader,
} from '.';
import {
    Id,
    QUERY_BUS_PORT,
    QueryBus,
    QueryHandler,
} from 'src/modules/shared/domain';

export class GetOnlineBusinessByIdQueryHandler
    implements
        QueryHandler<
            GetOnlineBusinessByIdQuery,
            GetOnlineBusinessByIdQueryResponse
        >
{
    constructor(
        private onlineBusinessReader: OnlineBusinessReader,
        @Inject(QUERY_BUS_PORT) private queryBus: QueryBus,
    ) {
        this.queryBus.addHanlder(GetOnlineBusinessByIdQuery.name, this);
    }

    async execute(
        query: GetOnlineBusinessByIdQuery,
    ): Promise<GetOnlineBusinessByIdQueryResponse> {
        const result = await this.onlineBusinessReader.getById(
            Id.createFrom(query.id),
        );
        return new GetOnlineBusinessByIdQueryResponse(
            result.status,
            result.onlineBusiness,
        );
    }
}
