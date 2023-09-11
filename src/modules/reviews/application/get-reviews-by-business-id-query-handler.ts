import {
    Id,
    PageNumber,
    PageSize,
    QUERY_BUS_PORT,
    QueryBus,
    QueryHandler,
} from 'src/modules/shared/domain';
import {
    GetReviewsByBusinessIdQuery,
    GetReviewsByBusinessIdQueryResponse,
    ReviewReader,
} from '.';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetReviewsByBusinessIdQueryHandler
    implements
        QueryHandler<
            GetReviewsByBusinessIdQuery,
            GetReviewsByBusinessIdQueryResponse
        >
{
    constructor(
        private reviewReader: ReviewReader,
        @Inject(QUERY_BUS_PORT) private queryBus: QueryBus,
    ) {
        this.queryBus.addHanlder(GetReviewsByBusinessIdQuery.name, this);
    }

    async execute(
        query: GetReviewsByBusinessIdQuery,
    ): Promise<GetReviewsByBusinessIdQueryResponse> {
        const pageNumber = query.pageNumber
            ? PageNumber.createFrom(Number(query.pageNumber))
            : PageNumber.createMinPageNumber();
        const pageSize = query.pageSize
            ? PageSize.createFrom(Number(query.pageSize))
            : PageSize.createMaxPageSize();
        const result = await this.reviewReader.getByBusinessId(
            Id.createFrom(query.businessId),
            pageNumber,
            pageSize,
        );
        return new GetReviewsByBusinessIdQueryResponse(
            result.status,
            result.reviewViews,
        );
    }
}
