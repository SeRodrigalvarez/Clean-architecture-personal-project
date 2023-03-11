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
    PhysicalBusinessReviewReader,
    PhysicalBusinessReviewReaderResultStatus,
} from 'src/modules/reviews/application';
import { Review } from 'src/modules/reviews/domain';
import {
    Id,
    PageSize,
    PageNumber,
    PAGE_NUMBER_MIN_VALUE,
    PAGE_SIZE_MIN_VALUE,
    PAGE_SIZE_MAX_VALUE,
} from 'src/modules/shared/domain';

export class GetPhysicalBusinesssReviewParam {
    @IsUUID()
    id: string;
}

export class GetPhysicalBusinesssReviewQuery {
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

@Controller('business/physical')
export class GetPhysicalBusinessReviewController {
    constructor(private reviewReader: PhysicalBusinessReviewReader) {}

    @Get(':id/review')
    getByBusinessId(
        @Param() param: GetPhysicalBusinesssReviewParam,
        @Query() query: GetPhysicalBusinesssReviewQuery,
    ) {
        const pageNumber = query.pageNumber
            ? PageNumber.createPageNumber(Number(query.pageNumber))
            : PageNumber.createMinPageNumber();
        const pageSize = query.pageSize
            ? PageSize.createPageSize(Number(query.pageSize))
            : PageSize.createMaxPageSize();
        const result = this.reviewReader.getByBusinessId(
            Id.createIdFrom(param.id),
            pageNumber,
            pageSize,
        );

        if (
            result.status ===
            PhysicalBusinessReviewReaderResultStatus.GENERIC_ERROR
        ) {
            throw new InternalServerErrorException();
        }

        if (
            result.status === PhysicalBusinessReviewReaderResultStatus.NOT_FOUND
        ) {
            throw new NotFoundException(
                `No reviews for the business with id ${param.id}`,
            );
        }

        return this.domainToJsonMapper(result.reviews);
    }

    @Get('review/:id')
    getById(@Param() param: GetPhysicalBusinesssReviewParam) {
        const result = this.reviewReader.getById(Id.createIdFrom(param.id));

        if (
            result.status ===
            PhysicalBusinessReviewReaderResultStatus.GENERIC_ERROR
        ) {
            throw new InternalServerErrorException();
        }

        if (
            result.status === PhysicalBusinessReviewReaderResultStatus.NOT_FOUND
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
