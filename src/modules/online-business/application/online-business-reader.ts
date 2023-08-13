import { Inject, Injectable } from '@nestjs/common';
import {
    ReviewRepository,
    REVIEW_REPOSITORY_PORT,
} from 'src/modules/reviews/domain';
import { Id, PageSize, PageNumber } from 'src/modules/shared/domain';
import {
    GetResult,
    GetResultStatus,
    OnlineBusiness,
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
    status: OnlineBusinessReaderResultStatus;
    onlineBusinesses?: ReaderOnlineBusiness[];
}

export interface GetOnlineBusinessByIdResult {
    status: OnlineBusinessReaderResultStatus;
    onlineBusiness?: ReaderOnlineBusinessById;
}

export enum OnlineBusinessReaderResultStatus {
    OK,
    NOT_FOUND,
    GENERIC_ERROR,
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
        if (result.status === GetResultStatus.GENERIC_ERROR) {
            return {
                status: OnlineBusinessReaderResultStatus.GENERIC_ERROR,
            };
        }
        if (result.status === GetResultStatus.NOT_FOUND) {
            return {
                status: OnlineBusinessReaderResultStatus.NOT_FOUND,
            };
        }
        return {
            status: OnlineBusinessReaderResultStatus.OK,
            onlineBusinesses: this.domainToResultDtoMapper(
                result.onlineBusinesses,
            ),
        };
    }

    async getById(id: Id): Promise<GetOnlineBusinessByIdResult> {
        const result = await this.onlineBusinessRepository.getById(id);

        if (result.status === GetResultStatus.GENERIC_ERROR) {
            return {
                status: OnlineBusinessReaderResultStatus.GENERIC_ERROR,
            };
        }

        if (result.status === GetResultStatus.NOT_FOUND) {
            return {
                status: OnlineBusinessReaderResultStatus.NOT_FOUND,
            };
        }

        const business = result.onlineBusiness;
        const averageRating =
            await this.reviewRepository.getAverageRatingByBusinessId(id);

        return {
            status: OnlineBusinessReaderResultStatus.OK,
            onlineBusiness: {
                id: business.id,
                name: business.name,
                email: business.email,
                website: business.website,
                reviewsAmount: 0, // TODO: reviewsAmount will be moved to Read Model
                averageRating,
            },
        };
    }

    private domainToResultDtoMapper(
        onlineBusinesses: OnlineBusiness[],
    ): ReaderOnlineBusiness[] {
        return onlineBusinesses.map((business) => ({
            id: business.id,
            name: business.name,
            website: business.website,
            email: business.email,
            reviewsAmount: 0, // TODO: reviewsAmount will be moved to Read Model
        }));
    }
}
