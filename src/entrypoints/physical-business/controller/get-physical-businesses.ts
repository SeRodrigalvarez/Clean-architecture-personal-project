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
    FilterPhysicalBusinessesResult,
    GetPhysicalBusinessesQuery,
    PhysicalBusinessReaderResultStatus,
} from 'src/modules/physical-business/application';
import {
    PAGE_NUMBER_MIN_VALUE,
    PAGE_SIZE_MAX_VALUE,
    PAGE_SIZE_MIN_VALUE,
} from 'src/modules/shared/domain';

export class FilterPhysicalBusinessesQuery {
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

@Controller('business/physical')
export class GetPhysicalBusinessesController {
    constructor(private queryBus: QueryBus) {}

    @Get()
    async execute(@Query() query: FilterPhysicalBusinessesQuery) {
        const result: FilterPhysicalBusinessesResult =
            await this.queryBus.execute(
                new GetPhysicalBusinessesQuery(
                    query.filter,
                    query.pageNumber,
                    query.pageSize,
                ),
            );

        if (
            result.status === PhysicalBusinessReaderResultStatus.GENERIC_ERROR
        ) {
            throw new InternalServerErrorException();
        }

        if (result.status === PhysicalBusinessReaderResultStatus.NOT_FOUND) {
            throw new NotFoundException(
                'No physical business found with the given filters',
            );
        }
        return result.physicalBusinesses;
    }
}
