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
    GetOnlineBusinessByIdQueryResult,
    GetOnlineBusinessByIdQueryResultStatus,
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
        const result: GetOnlineBusinessByIdQueryResult =
            await this.queryBus.execute(
                new GetOnlineBusinessByIdQuery(param.id),
            );

        if (
            result.status ===
            GetOnlineBusinessByIdQueryResultStatus.GENERIC_ERROR
        ) {
            throw new InternalServerErrorException();
        }

        if (
            result.status === GetOnlineBusinessByIdQueryResultStatus.NOT_FOUND
        ) {
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
            averageRating: business.averageRating,
        };
    }
}
