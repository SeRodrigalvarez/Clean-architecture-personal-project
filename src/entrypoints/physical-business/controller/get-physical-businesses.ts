import {
    Controller,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Query,
} from '@nestjs/common';
import { IsString, IsOptional, IsUUID } from 'class-validator';
import {
    PhysicalBusinessReader,
    PhysicalBusinessReaderResultStatus,
} from 'src/modules/physical-business/application';
import { PhysicalBusiness } from 'src/modules/physical-business/domain';
import { Id } from 'src/modules/shared/domain';

export class FilterPhysicalBusinessesQuery {
    @IsOptional()
    @IsString()
    filter: string;
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
        const result = this.physicalBusinessReader.filter(query.filter);

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
        }));
    }
}
