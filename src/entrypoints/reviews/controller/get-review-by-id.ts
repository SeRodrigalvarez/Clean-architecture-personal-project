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
    GetReviewByIdQuery,
    GetReviewByIdQueryResponse,
} from 'src/modules/reviews/application';
import { GetViewResultStatus } from 'src/modules/reviews/domain';
import { QUERY_BUS_PORT, QueryBus } from 'src/modules/shared/domain';

export class GetReviewByIdParam {
    @IsUUID()
    id: string;
}

@Controller('business')
export class GetReviewByIdController {
    constructor(@Inject(QUERY_BUS_PORT) private queryBus: QueryBus) {}

    @Get('review/:id')
    async execute(@Param() param: GetReviewByIdParam) {
        const result: GetReviewByIdQueryResponse = await this.queryBus.ask(
            new GetReviewByIdQuery(param.id),
        );

        if (result.status === GetViewResultStatus.GENERIC_ERROR) {
            throw new InternalServerErrorException();
        }

        if (result.status === GetViewResultStatus.NOT_FOUND) {
            throw new NotFoundException(
                `No reviews for the business with id ${param.id}`,
            );
        }

        return result.reviewView;
    }
}
