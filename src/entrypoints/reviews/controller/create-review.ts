import {
    BadRequestException,
    Body,
    Controller,
    Inject,
    InternalServerErrorException,
    Param,
    Post,
} from '@nestjs/common';
import { IsInt, IsString, IsUUID, Length, Max, Min } from 'class-validator';
import {
    CreateReviewCommand,
    CreateReviewCommandResponse,
    ReviewCreatorResultStatus,
} from 'src/modules/reviews/application';
import {
    TEXT_MAX_LENGTH,
    TEXT_MIN_LENGTH,
    USERNAME_MAX_LENGTH,
    USERNAME_MIN_LENGTH,
} from 'src/modules/reviews/domain';
import {
    COMMAND_BUS_PORT,
    CommandBus,
    RATING_MAX_VALUE,
    RATING_MIN_VALUE,
} from 'src/modules/shared/domain';

export class CreateReviewParam {
    @IsUUID()
    businessId: string;
}

export class CreateReviewBody {
    @IsUUID()
    id: string;

    @IsString()
    @Length(TEXT_MIN_LENGTH, TEXT_MAX_LENGTH)
    text: string;

    @IsInt()
    @Min(RATING_MIN_VALUE)
    @Max(RATING_MAX_VALUE)
    rating: number;

    @IsString()
    @Length(USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH)
    username: string;
}

@Controller('business')
export class CreateReviewController {
    constructor(@Inject(COMMAND_BUS_PORT) private commandBus: CommandBus) {}

    @Post(':businessId/review')
    async execute(
        @Param() param: CreateReviewParam,
        @Body() body: CreateReviewBody,
    ) {
        const result: CreateReviewCommandResponse =
            await this.commandBus.execute(
                new CreateReviewCommand(
                    body.id,
                    param.businessId,
                    body.text,
                    body.rating,
                    body.username,
                ),
            );

        if (result.status === ReviewCreatorResultStatus.GENERIC_ERROR) {
            throw new InternalServerErrorException();
        }

        if (
            result.status === ReviewCreatorResultStatus.NON_EXISTANT_BUSINESS_ID
        ) {
            throw new BadRequestException(
                `There is no business with id ${param.businessId}`,
            );
        }
        if (result.status === ReviewCreatorResultStatus.DUPLICATED_REVIEW) {
            throw new BadRequestException(
                `There is already a review from user ${body.username} for the business with id ${param.businessId}`,
            );
        }
    }
}
