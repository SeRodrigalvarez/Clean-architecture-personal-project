import {
    BadRequestException,
    Body,
    Controller,
    InternalServerErrorException,
    Param,
    Post,
} from '@nestjs/common';
import { IsInt, IsString, IsUUID, Length, Max, Min } from 'class-validator';
import {
    OnlineBusinessReviewCreator,
    OnlineBusinessReviewCreatorResultStatus,
} from 'src/modules/reviews/application';
import {
    RATING_MAX_VALUE,
    RATING_MIN_VALUE,
    ReviewRating,
    ReviewText,
    TEXT_MAX_LENGTH,
    TEXT_MIN_LENGTH,
    Username,
    USERNAME_MAX_LENGTH,
    USERNAME_MIN_LENGTH,
} from 'src/modules/reviews/domain';
import { Id } from 'src/modules/shared/domain';

export class CreateOnlineBusinessReviewParam {
    @IsUUID()
    businessId: string;
}

export class CreateOnlineBusinessReviewBody {
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

@Controller('business/online')
export class CreateOnlineBusinessReviewController {
    constructor(private reviewCreator: OnlineBusinessReviewCreator) {}

    @Post(':businessId/review')
    async execute(
        @Param() param: CreateOnlineBusinessReviewParam,
        @Body() body: CreateOnlineBusinessReviewBody,
    ) {
        const result = await this.reviewCreator.execute(
            Id.createFrom(param.businessId),
            new ReviewText(body.text),
            new ReviewRating(body.rating),
            new Username(body.username),
        );

        if (
            result.status ===
            OnlineBusinessReviewCreatorResultStatus.GENERIC_ERROR
        ) {
            throw new InternalServerErrorException();
        }

        if (
            result.status ===
            OnlineBusinessReviewCreatorResultStatus.NON_EXISTANT_BUSINESS_ID
        ) {
            throw new BadRequestException(
                `There is no business with id ${param.businessId}`,
            );
        }
        if (
            result.status ===
            OnlineBusinessReviewCreatorResultStatus.DUPLICATED_REVIEW
        ) {
            throw new BadRequestException(
                `There is already a review from user ${body.username} for the business with id ${param.businessId}`,
            );
        }
        return {
            id: result.id,
        };
    }
}
