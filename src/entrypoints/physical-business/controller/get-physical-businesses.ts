import {
    Controller,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Query,
} from '@nestjs/common';
import { IsString, IsUUID, Length, IsOptional } from 'class-validator';
import {
    PhysicalBusinessReader,
    PhysicalBusinessReaderResultStatus,
} from 'src/modules/physical-business/application';
import {
    NAME_MAX_LENGTH,
    NAME_MIN_LENGTH,
    PhysicalBusiness,
    PhysicalBusinessName,
} from 'src/modules/physical-business/domain';
import { Id } from 'src/modules/shared/domain';

export class GetPhysicalBusinessQueryParams {
    @IsOptional()
    @IsString()
    @Length(NAME_MIN_LENGTH, NAME_MAX_LENGTH)
    name: string;

    @IsOptional()
    @IsUUID()
    id: string;
}

@Controller('business/physical')
export class GetPhysicalBusinessController {
    constructor(private physicalBusinessReader: PhysicalBusinessReader) {}

    @Get()
    execute(@Query() query: GetPhysicalBusinessQueryParams) {
        const id = query.id ? Id.createIdFrom(query.id) : undefined;
        const name = query.name
            ? new PhysicalBusinessName(query.name)
            : undefined;
        const result = this.physicalBusinessReader.execute(id, name);

        if (
            result.status === PhysicalBusinessReaderResultStatus.GENERIC_ERROR
        ) {
            throw new InternalServerErrorException();
        }

        if (result.status === PhysicalBusinessReaderResultStatus.NOT_FOUND) {
            throw new NotFoundException(
                'No result found with the given filters',
            );
        }
        return this.domainToJsonMapper(result.physicalBusinesses);
    }

    private domainToJsonMapper(physicalBusinesses: PhysicalBusiness[]) {
        return physicalBusinesses.map((business) => ({
            id: business.id,
            name: business.name,
            address: business.address,
            phone: business.phone,
            reviewAmount: business.reviewsAmount,
        }));
    }
}
