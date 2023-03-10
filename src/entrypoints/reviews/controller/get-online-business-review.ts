import {
    Controller,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Param,
} from '@nestjs/common';
import { IsUUID } from 'class-validator';
import {
    OnlineBusinessReviewReader,
    OnlineBusinessReviewReaderResultStatus,
} from 'src/modules/reviews/application';
import { Review } from 'src/modules/reviews/domain';
import { Id } from 'src/modules/shared/domain';

export class GetOnlineBusinesssReviewParam {
    @IsUUID()
    id: string;
}

@Controller('business/online')
export class GetOnlineBusinessReviewController {
    constructor(private reviewReader: OnlineBusinessReviewReader) {}

    @Get(':id/review')
    getByBusinessId(@Param() param: GetOnlineBusinesssReviewParam) {
        const result = this.reviewReader.getByBusinessId(
            Id.createIdFrom(param.id),
        );

        if (
            result.status ===
            OnlineBusinessReviewReaderResultStatus.GENERIC_ERROR
        ) {
            throw new InternalServerErrorException();
        }

        if (
            result.status === OnlineBusinessReviewReaderResultStatus.NOT_FOUND
        ) {
            throw new NotFoundException(
                `No reviews for the business with id ${param.id}`,
            );
        }

        return this.domainToJsonMapper(result.reviews);
    }

    @Get('review/:id')
    getById(@Param() param: GetOnlineBusinesssReviewParam) {
        const result = this.reviewReader.getById(Id.createIdFrom(param.id));

        if (
            result.status ===
            OnlineBusinessReviewReaderResultStatus.GENERIC_ERROR
        ) {
            throw new InternalServerErrorException();
        }

        if (
            result.status === OnlineBusinessReviewReaderResultStatus.NOT_FOUND
        ) {
            throw new NotFoundException(
                `No reviews for the business with id ${param.id}`,
            );
        }

        const review = result.review;

        return {
            id: review.id,
            businessId: review.businessId,
            text: review.text,
            rating: review.rating,
            username: review.username,
        };
    }

    private domainToJsonMapper(reviews: Review[]) {
        return reviews.map((review) => ({
            id: review.id,
            businessId: review.businessId,
            text: review.text,
            rating: review.rating,
            username: review.username,
        }));
    }
}
