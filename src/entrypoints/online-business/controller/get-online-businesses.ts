import {
    Controller,
    Get,
    Inject,
    InternalServerErrorException,
    NotFoundException,
    Query,
} from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsString, IsOptional, IsInt, Max, Min } from 'class-validator';
import {
    GetOnlineBusinessesQuery,
    GetOnlineBusinessesQueryResponse,
} from 'src/modules/online-business/application';
import { GetViewResultStatus } from 'src/modules/online-business/domain';
import {
    PAGE_NUMBER_MIN_VALUE,
    PAGE_SIZE_MAX_VALUE,
    PAGE_SIZE_MIN_VALUE,
    QUERY_BUS_PORT,
    QueryBus,
} from 'src/modules/shared/domain';

export class FilterOnlineBusinessesQuery {
    @IsOptional()
    @IsString()
    filter: string;
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

@Controller('business/online')
export class GetOnlineBusinessesController {
    constructor(@Inject(QUERY_BUS_PORT) private queryBus: QueryBus) {}

    @Get()
    async execute(@Query() query: FilterOnlineBusinessesQuery) {
        const result = await this.queryBus.ask<
            GetOnlineBusinessesQuery,
            GetOnlineBusinessesQueryResponse
        >(
            new GetOnlineBusinessesQuery(
                query.filter,
                query.pageNumber,
                query.pageSize,
            ),
        );

        if (result.status === GetViewResultStatus.GENERIC_ERROR) {
            throw new InternalServerErrorException();
        }

        if (result.status === GetViewResultStatus.NOT_FOUND) {
            throw new NotFoundException(
                'No online businesses found with the given filters',
            );
        }

        return result.onlineBusinesses;
    }
}
