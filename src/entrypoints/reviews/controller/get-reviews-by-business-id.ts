import {
    Controller,
    Get,
    Inject,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Query,
} from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import {
    GetReviewsByBusinessIdQuery,
    GetReviewsByBusinessIdQueryResponse,
} from 'src/modules/reviews/application';
import { GetViewResultStatus } from 'src/modules/reviews/domain';
import {
    PAGE_NUMBER_MIN_VALUE,
    PAGE_SIZE_MAX_VALUE,
    PAGE_SIZE_MIN_VALUE,
    QUERY_BUS_PORT,
    QueryBus,
} from 'src/modules/shared/domain';

export class GetReviewsByBusinessIdParam {
    @IsUUID()
    id: string;
}

export class GetReviewsByBusinessIdQueryParams {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(PAGE_NUMBER_MIN_VALUE)
    pageNumber: string;
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(PAGE_SIZE_MIN_VALUE)
    @Max(PAGE_SIZE_MAX_VALUE)
    pageSize: string;
}

@Controller('business')
export class GetReviewsByBusinessIdController {
    constructor(@Inject(QUERY_BUS_PORT) private queryBus: QueryBus) {}

    @Get(':id/review')
    async execute(
        @Param() param: GetReviewsByBusinessIdParam,
        @Query() query: GetReviewsByBusinessIdQueryParams,
    ) {
        const result: GetReviewsByBusinessIdQueryResponse =
            await this.queryBus.ask(
                new GetReviewsByBusinessIdQuery(
                    param.id,
                    query.pageNumber,
                    query.pageSize,
                ),
            );

        if (result.status === GetViewResultStatus.GENERIC_ERROR) {
            throw new InternalServerErrorException();
        }

        if (result.status === GetViewResultStatus.NOT_FOUND) {
            throw new NotFoundException(
                `No reviews for the business with id ${param.id}`,
            );
        }

        return result.reviewViews;
    }
}
