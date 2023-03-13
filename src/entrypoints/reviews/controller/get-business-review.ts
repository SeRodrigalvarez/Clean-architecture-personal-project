import {
    Controller,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Query,
} from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import {
    BusinessReviewReader,
    BusinessReviewReaderResultStatus,
} from 'src/modules/reviews/application';
import { Review } from 'src/modules/reviews/domain';
import {
    Id,
    PageSize,
    PageNumber,
    PAGE_NUMBER_MIN_VALUE,
    PAGE_SIZE_MAX_VALUE,
    PAGE_SIZE_MIN_VALUE,
} from 'src/modules/shared/domain';

export class GetBusinesssReviewParam {
    @IsUUID()
    id: string;
}

export class GetBusinesssReviewQuery {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(PAGE_NUMBER_MIN_VALUE)
    pageNumber: string;
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(PAGE_SIZE_MIN_VALUE)
    @Max(PAGE_SIZE_MAX_VALUE)
    pageSize: string;
}

@Controller('business')
export class GetBusinessReviewController {
    constructor(private reviewReader: BusinessReviewReader) {}

    @Get(':id/review')
    async getByBusinessId(
        @Param() param: GetBusinesssReviewParam,
        @Query() query: GetBusinesssReviewQuery,
    ) {
        const pageNumber = query.pageNumber
            ? PageNumber.createFrom(Number(query.pageNumber))
            : PageNumber.createMinPageNumber();
        const pageSize = query.pageSize
            ? PageSize.createFrom(Number(query.pageSize))
            : PageSize.createMaxPageSize();
        const result = await this.reviewReader.getByBusinessId(
            Id.createFrom(param.id),
            pageNumber,
            pageSize,
        );

        if (result.status === BusinessReviewReaderResultStatus.GENERIC_ERROR) {
            throw new InternalServerErrorException();
        }

        if (result.status === BusinessReviewReaderResultStatus.NOT_FOUND) {
            throw new NotFoundException(
                `No reviews for the business with id ${param.id}`,
            );
        }

        return this.domainToJsonMapper(result.reviews);
    }

    @Get('review/:id')
    async getById(@Param() param: GetBusinesssReviewParam) {
        const result = await this.reviewReader.getById(Id.createFrom(param.id));

        if (result.status === BusinessReviewReaderResultStatus.GENERIC_ERROR) {
            throw new InternalServerErrorException();
        }

        if (result.status === BusinessReviewReaderResultStatus.NOT_FOUND) {
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
