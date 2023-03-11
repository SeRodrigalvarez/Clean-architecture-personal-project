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
    PhysicalBusinessReviewCreator,
    PhysicalBusinessReviewCreatorResultStatus,
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

export class CreatePhysicalBusinessReviewParam {
    @IsUUID()
    businessId: string;
}

export class CreatePhysicalBusinessReviewBody {
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

@Controller('business/physical')
export class CreatePhysicalBusinessReviewController {
    constructor(private reviewCreator: PhysicalBusinessReviewCreator) {}

    @Post(':businessId/review')
    async execute(
        @Param() param: CreatePhysicalBusinessReviewParam,
        @Body() body: CreatePhysicalBusinessReviewBody,
    ) {
        const result = await this.reviewCreator.execute(
            Id.createIdFrom(param.businessId),
            new ReviewText(body.text),
            new ReviewRating(body.rating),
            new Username(body.username),
        );

        if (
            result.status ===
            PhysicalBusinessReviewCreatorResultStatus.GENERIC_ERROR
        ) {
            throw new InternalServerErrorException();
        }

        if (
            result.status ===
            PhysicalBusinessReviewCreatorResultStatus.NON_EXISTANT_BUSINESS_ID
        ) {
            throw new BadRequestException(
                `There is no business with id ${param.businessId}`,
            );
        }
        if (
            result.status ===
            PhysicalBusinessReviewCreatorResultStatus.DUPLICATED_REVIEW
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
