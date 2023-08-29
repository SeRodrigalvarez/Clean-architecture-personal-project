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
    GetOnlineBusinessByIdQuery,
    GetOnlineBusinessByIdQueryResponse,
} from 'src/modules/online-business/application';
import { GetViewResultStatus } from 'src/modules/online-business/domain';
import { QUERY_BUS_PORT, QueryBus } from 'src/modules/shared/domain';

export class GetOnlineBusinesssParam {
    @IsUUID()
    id: string;
}

@Controller('business/online')
export class GetOnlineBusinessByIdController {
    constructor(@Inject(QUERY_BUS_PORT) private queryBus: QueryBus) {}

    @Get(':id')
    async execute(@Param() param: GetOnlineBusinesssParam) {
        const result: GetOnlineBusinessByIdQueryResponse =
            await this.queryBus.ask(new GetOnlineBusinessByIdQuery(param.id));

        if (result.status === GetViewResultStatus.GENERIC_ERROR) {
            throw new InternalServerErrorException();
        }

        if (result.status === GetViewResultStatus.NOT_FOUND) {
            throw new NotFoundException(
                `No online business with id: ${param.id}`,
            );
        }

        return result.onlineBusiness;
    }
}
