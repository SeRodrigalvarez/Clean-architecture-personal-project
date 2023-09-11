import {
    Id,
    QUERY_BUS_PORT,
    QueryBus,
    QueryHandler,
} from 'src/modules/shared/domain';
import {
    GetReviewByIdQuery,
    GetReviewByIdQueryResponse,
    ReviewReader,
} from '.';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetReviewByIdQueryHandler
    implements QueryHandler<GetReviewByIdQuery, GetReviewByIdQueryResponse>
{
    constructor(
        private reviewReader: ReviewReader,
        @Inject(QUERY_BUS_PORT) private queryBus: QueryBus,
    ) {
        this.queryBus.addHanlder(GetReviewByIdQuery.name, this);
    }

    async execute(
        query: GetReviewByIdQuery,
    ): Promise<GetReviewByIdQueryResponse> {
        const result = await this.reviewReader.getById(Id.createFrom(query.id));
        return new GetReviewByIdQueryResponse(result.status, result.reviewView);
    }
}
