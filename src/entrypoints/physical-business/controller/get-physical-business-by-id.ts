import {
    Controller,
    Get,
    Inject,
    InternalServerErrorException,
    NotFoundException,
    Param,
} from '@nestjs/common';
import { IsUUID } from 'class-validator';
import {
    GetPhysicalBusinessByIdQuery,
    GetPhysicalBusinessByIdQueryResponse,
} from 'src/modules/physical-business/application';
import { GetViewResultStatus } from 'src/modules/physical-business/domain';
import { QUERY_BUS_PORT, QueryBus } from 'src/modules/shared/domain';

export class GetPhysicalBusinesssParam {
    @IsUUID()
    id: string;
}

@Controller('business/physical')
export class GetPhysicalBusinessByIdController {
    constructor(@Inject(QUERY_BUS_PORT) private queryBus: QueryBus) {}

    @Get(':id')
    async execute(@Param() param: GetPhysicalBusinesssParam) {
        const result: GetPhysicalBusinessByIdQueryResponse =
            await this.queryBus.ask(new GetPhysicalBusinessByIdQuery(param.id));

        if (result.status === GetViewResultStatus.GENERIC_ERROR) {
            throw new InternalServerErrorException();
        }

        if (result.status === GetViewResultStatus.NOT_FOUND) {
            throw new NotFoundException(
                `No physical business with id: ${param.id}`,
            );
        }

        return result.physicalBusiness;
    }
}
