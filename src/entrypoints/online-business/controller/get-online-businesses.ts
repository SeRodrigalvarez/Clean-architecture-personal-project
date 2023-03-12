import {
    Controller,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Query,
} from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsString, IsOptional, IsUUID, IsInt, Max, Min } from 'class-validator';
import {
    OnlineBusinessReader,
    OnlineBusinessReaderResultStatus,
} from 'src/modules/online-business/application';
import { OnlineBusiness } from 'src/modules/online-business/domain';
import {
    Id,
    PageSize,
    PageNumber,
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

export class GetOnlineBusinesssParam {
    @IsUUID()
    id: string;
}

@Controller('business/online')
export class GetOnlineBusinessController {
    constructor(private onlineBusinessReader: OnlineBusinessReader) {}

    @Get()
    async filter(@Query() query: FilterOnlineBusinessesQuery) {
        const pageNumber = query.pageNumber
            ? PageNumber.createFrom(Number(query.pageNumber))
            : PageNumber.createMinPageNumber();
        const pageSize = query.pageSize
            ? PageSize.createFrom(Number(query.pageSize))
            : PageSize.createMaxPageSize();
        const result = await this.onlineBusinessReader.filter(
            pageNumber,
            pageSize,
            query.filter,
        );

        if (result.status === OnlineBusinessReaderResultStatus.GENERIC_ERROR) {
            throw new InternalServerErrorException();
        }

        if (result.status === OnlineBusinessReaderResultStatus.NOT_FOUND) {
            throw new NotFoundException(
                'No online businesses found with the given filters',
            );
        }
        return this.domainToJsonMapper(result.onlineBusinesses);
    }

    @Get(':id')
    async getById(@Param() param: GetOnlineBusinesssParam) {
        const result = await this.onlineBusinessReader.getById(
            Id.createFrom(param.id),
        );

        if (result.status === OnlineBusinessReaderResultStatus.GENERIC_ERROR) {
            throw new InternalServerErrorException();
        }

        if (result.status === OnlineBusinessReaderResultStatus.NOT_FOUND) {
            throw new NotFoundException(
                `No online business with id: ${param.id}`,
            );
        }

        const business = result.onlineBusiness;

        return {
            id: business.id,
            name: business.name,
            website: business.website,
            email: business.email,
            reviewAmount: business.reviewsAmount,
        };
    }

    private domainToJsonMapper(onlineBusinesses: OnlineBusiness[]) {
        return onlineBusinesses.map((business) => ({
            id: business.id,
            name: business.name,
            website: business.website,
            email: business.email,
            reviewAmount: business.reviewsAmount,
        }));
    }
}
