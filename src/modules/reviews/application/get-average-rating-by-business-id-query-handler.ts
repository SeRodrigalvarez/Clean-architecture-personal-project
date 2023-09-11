import {
    Id,
    QUERY_BUS_PORT,
    QueryBus,
    QueryHandler,
} from 'src/modules/shared/domain';
import {
    GetAverageRatingByBusinessIdQuery,
    GetAverageRatingByBusinessIdQueryResponse,
    ReviewReader,
} from '.';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetAverageRatingByBusinessIdQueryHandler
    implements
        QueryHandler<
            GetAverageRatingByBusinessIdQuery,
            GetAverageRatingByBusinessIdQueryResponse
        >
{
    constructor(
        private reviewReader: ReviewReader,
        @Inject(QUERY_BUS_PORT) private queryBus: QueryBus,
    ) {
        this.queryBus.addHanlder(GetAverageRatingByBusinessIdQuery.name, this);
    }
    async execute(
        query: GetAverageRatingByBusinessIdQuery,
    ): Promise<GetAverageRatingByBusinessIdQueryResponse> {
        const avgRating = await this.reviewReader.getAverageRatingByBusinessId(
            Id.createFrom(query.businessId),
        );
        return new GetAverageRatingByBusinessIdQueryResponse(
            avgRating === 0 ? 1 : avgRating,
        );
    }
}
