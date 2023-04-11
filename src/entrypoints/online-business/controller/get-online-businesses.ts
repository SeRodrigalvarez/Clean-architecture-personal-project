import {
    Controller,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Query,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Type } from 'class-transformer';
import { IsString, IsOptional, IsInt, Max, Min } from 'class-validator';
import {
    FilterOnlineBusinessesResult,
    GetOnlineBusinessesQuery,
    OnlineBusinessReaderResultStatus,
} from 'src/modules/online-business/application';
import {
    PAGE_NUMBER_MIN_VALUE,
    PAGE_SIZE_MAX_VALUE,
    PAGE_SIZE_MIN_VALUE,
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
    constructor(private queryBus: QueryBus) {}

    @Get()
    async execute(@Query() query: FilterOnlineBusinessesQuery) {
        const result: FilterOnlineBusinessesResult =
            await this.queryBus.execute(
                new GetOnlineBusinessesQuery(
                    query.filter,
                    query.pageNumber,
                    query.pageSize,
                ),
            );

        if (result.status === OnlineBusinessReaderResultStatus.GENERIC_ERROR) {
            throw new InternalServerErrorException();
        }

        if (result.status === OnlineBusinessReaderResultStatus.NOT_FOUND) {
            throw new NotFoundException(
                'No online businesses found with the given filters',
            );
        }

        return result.onlineBusinesses;
    }
}
