import {
    Controller,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Param,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { IsUUID } from 'class-validator';
import {
    GetPhysicalBusinessByIdQuery,
    GetPhysicalBusinessByIdResult,
    PhysicalBusinessReaderResultStatus,
} from 'src/modules/physical-business/application';

export class GetPhysicalBusinesssParam {
    @IsUUID()
    id: string;
}

@Controller('business/physical')
export class GetPhysicalBusinessByIdController {
    constructor(private queryBus: QueryBus) {}

    @Get(':id')
    async execute(@Param() param: GetPhysicalBusinesssParam) {
        const result: GetPhysicalBusinessByIdResult =
            await this.queryBus.execute(
                new GetPhysicalBusinessByIdQuery(param.id),
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

        return result.physicalBusiness;
    }
}
