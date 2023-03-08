import {
    Controller,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Param,
} from '@nestjs/common';
import { IsUUID } from 'class-validator';
import {
    ReviewReader,
    ReviewReaderResultStatus,
} from 'src/modules/reviews/application';
import { Review } from 'src/modules/reviews/domain';
import { Id } from 'src/modules/shared/domain';

export class GetReviewParam {
    @IsUUID()
    id: string;
}

@Controller('review')
export class GetReviewController {
    constructor(private reviewReader: ReviewReader) {}

    @Get(':id')
    execute(@Param() param: GetReviewParam) {
        const result = this.reviewReader.execute(Id.createIdFrom(param.id));

        if (result.status === ReviewReaderResultStatus.GENERIC_ERROR) {
            throw new InternalServerErrorException();
        }

        if (result.status === ReviewReaderResultStatus.NOT_FOUND) {
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
