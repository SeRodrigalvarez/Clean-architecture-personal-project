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

@Controller('business/online/review')
export class GetOnlineBusinessReviewController {
    constructor(private reviewReader: OnlineBusinessReviewReader) {}

    @Get(':id')
    execute(@Param() param: GetOnlineBusinesssReviewParam) {
        const result = this.reviewReader.execute(Id.createIdFrom(param.id));

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
