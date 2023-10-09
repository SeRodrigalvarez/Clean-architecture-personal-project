import { Inject, Injectable } from '@nestjs/common';
import {
    ReviewRepository,
    REVIEW_REPOSITORY_PORT,
} from 'src/modules/reviews/domain';
import { Id, PageSize, PageNumber } from 'src/modules/shared/domain';
import {
    GetResult,
    GetResultStatus,
    OnlineBusinessRepository,
    ONLINE_BUSINESS_PORT,
} from '../domain';

export interface ReaderOnlineBusiness {
    id: string;
    name: string;
    website: string;
    email: string;
    reviewsAmount: number;
}

export interface ReaderOnlineBusinessById extends ReaderOnlineBusiness {
    averageRating: number;
}

export interface FilterOnlineBusinessesResult {
    status: GetResultStatus;
    onlineBusinesses?: ReaderOnlineBusiness[];
}

export interface GetOnlineBusinessByIdResult {
    status: GetResultStatus;
    onlineBusiness?: ReaderOnlineBusinessById;
}

@Injectable()
export class OnlineBusinessReader {
    constructor(
        @Inject(ONLINE_BUSINESS_PORT)
        private onlineBusinessRepository: OnlineBusinessRepository,
        @Inject(REVIEW_REPOSITORY_PORT)
        private reviewRepository: ReviewRepository,
    ) {}

    async filter(
        pageNumber: PageNumber,
        pageSize: PageSize,
        value?: string,
    ): Promise<FilterOnlineBusinessesResult> {
        let result: GetResult;
        if (value) {
            result = await this.onlineBusinessRepository.getByNameOrWebsite(
                value,
                pageNumber,
                pageSize,
            );
        } else {
            result = await this.onlineBusinessRepository.getAll(
                pageNumber,
                pageSize,
            );
        }
        if (result.status !== GetResultStatus.OK) {
            return {
                status: result.status,
            };
        }
        return {
            status: GetResultStatus.OK,
            onlineBusinesses: result.onlineBusinesses?.map((business) =>
                business.toPrimitives(),
            ),
        };
    }

    async getById(id: Id): Promise<GetOnlineBusinessByIdResult> {
        const result = await this.onlineBusinessRepository.getById(id);

        if (result.status !== GetResultStatus.OK) {
            return {
                status: result.status,
            };
        }

        const business = result.onlineBusiness;
        // TODO: Switch to eager calculation when a new review is created
        const averageRating =
            await this.reviewRepository.getAverageRatingByBusinessId(id);

        return {
            status: GetResultStatus.OK,
            onlineBusiness: {
                id: business.id,
                name: business.name,
                email: business.email,
                website: business.website,
                reviewsAmount: business.reviewsAmount,
                averageRating,
            },
        };
    }
}
