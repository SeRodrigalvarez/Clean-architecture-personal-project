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
import { PhysicalBusinessReader } from 'src/modules/physical-business/application';
import { GetResultStatus } from 'src/modules/physical-business/domain';
import {
    Id,
    PageSize,
    PageNumber,
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

export class GetPhysicalBusinesssParam {
    @IsUUID()
    id: string;
}

@Controller('business/physical')
export class GetPhysicalBusinessController {
    constructor(private physicalBusinessReader: PhysicalBusinessReader) {}

    @Get()
    async filter(@Query() query: FilterPhysicalBusinessesQuery) {
        const pageNumber = query.pageNumber
            ? PageNumber.createFrom(Number(query.pageNumber))
            : PageNumber.createMinPageNumber();
        const pageSize = query.pageSize
            ? PageSize.createFrom(Number(query.pageSize))
            : PageSize.createMaxPageSize();
        const result = await this.physicalBusinessReader.filter(
            pageNumber,
            pageSize,
            query.filter,
        );

        if (result.status === GetResultStatus.GENERIC_ERROR) {
            throw new InternalServerErrorException();
        }

        if (result.status === GetResultStatus.NOT_FOUND) {
            throw new NotFoundException(
                'No physical business found with the given filters',
            );
        }
        return result.physicalBusinesses;
    }

    @Get(':id')
    async getById(@Param() param: GetPhysicalBusinesssParam) {
        const result = await this.physicalBusinessReader.getById(
            Id.createFrom(param.id),
        );

        if (result.status === GetResultStatus.GENERIC_ERROR) {
            throw new InternalServerErrorException();
        }

        if (result.status === GetResultStatus.NOT_FOUND) {
            throw new NotFoundException(
                `No physical business with id: ${param.id}`,
            );
        }

        const business = result.physicalBusiness;

        return {
            id: business.id,
            name: business.name,
            address: business.address,
            phone: business.phone,
            email: business.email,
            reviewAmount: business.reviewsAmount,
            averageRating: business.averageRating,
        };
    }
}
