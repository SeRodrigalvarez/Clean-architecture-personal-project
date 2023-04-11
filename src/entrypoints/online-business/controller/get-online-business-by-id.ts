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
    GetOnlineBusinessByIdQuery,
    GetOnlineBusinessByIdResult,
    OnlineBusinessReaderResultStatus,
} from 'src/modules/online-business/application';

export class GetOnlineBusinesssParam {
    @IsUUID()
    id: string;
}

@Controller('business/online')
export class GetOnlineBusinessByIdController {
    constructor(private queryBus: QueryBus) {}

    @Get(':id')
    async execute(@Param() param: GetOnlineBusinesssParam) {
        const result: GetOnlineBusinessByIdResult = await this.queryBus.execute(
            new GetOnlineBusinessByIdQuery(param.id),
        );

        if (result.status === OnlineBusinessReaderResultStatus.GENERIC_ERROR) {
            throw new InternalServerErrorException();
        }

        if (result.status === OnlineBusinessReaderResultStatus.NOT_FOUND) {
            throw new NotFoundException(
                `No online business with id: ${param.id}`,
            );
        }

        return result.onlineBusiness;
    }
}
