import {
    GetPhysicalBusinessByIdQuery,
    GetPhysicalBusinessByIdQueryResponse,
    PhysicalBusinessReader,
} from '.';
import {
    Id,
    QUERY_BUS_PORT,
    QueryBus,
    QueryHandler,
} from 'src/modules/shared/domain';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetPhysicalBusinessByIdQueryHanlder
    implements
        QueryHandler<
            GetPhysicalBusinessByIdQuery,
            GetPhysicalBusinessByIdQueryResponse
        >
{
    constructor(
        private physicalBusinessReader: PhysicalBusinessReader,
        @Inject(QUERY_BUS_PORT) private queryBus: QueryBus,
    ) {
        this.queryBus.addHanlder(GetPhysicalBusinessByIdQuery.QUERY_NAME, this);
    }

    async execute(
        query: GetPhysicalBusinessByIdQuery,
    ): Promise<GetPhysicalBusinessByIdQueryResponse> {
        const result = await this.physicalBusinessReader.getById(
            Id.createFrom(query.id),
        );
        return new GetPhysicalBusinessByIdQueryResponse(
            result.status,
            result.physicalBusiness,
        );
    }
}
