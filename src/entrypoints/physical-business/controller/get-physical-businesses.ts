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
    PhysicalBusinessReader,
    PhysicalBusinessReaderResultStatus,
} from 'src/modules/physical-business/application';
import { PhysicalBusiness } from 'src/modules/physical-business/domain';
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
    filter(@Query() query: FilterPhysicalBusinessesQuery) {
        const pageNumber = query.pageNumber
            ? PageNumber.createPageNumber(Number(query.pageNumber))
            : PageNumber.createMinPageNumber();
        const pageSize = query.pageSize
            ? PageSize.createPageSize(Number(query.pageSize))
            : PageSize.createMaxPageSize();
        const result = this.physicalBusinessReader.filter(
            pageNumber,
            pageSize,
            query.filter,
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
        return this.domainToJsonMapper(result.physicalBusinesses);
    }

    @Get(':id')
    getById(@Param() param: GetPhysicalBusinesssParam) {
        const result = this.physicalBusinessReader.getById(
            Id.createIdFrom(param.id),
        );

        if (
            result.status === PhysicalBusinessReaderResultStatus.GENERIC_ERROR
        ) {
            throw new InternalServerErrorException();
        }

        if (result.status === PhysicalBusinessReaderResultStatus.NOT_FOUND) {
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
        };
    }

    private domainToJsonMapper(physicalBusinesses: PhysicalBusiness[]) {
        return physicalBusinesses.map((business) => ({
            id: business.id,
            name: business.name,
            address: business.address,
            email: business.email,
            reviewAmount: business.reviewsAmount,
        }));
    }
}
