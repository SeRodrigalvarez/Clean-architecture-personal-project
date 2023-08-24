import { Inject, Injectable } from '@nestjs/common';
import {
    ReviewRepository,
    REVIEW_REPOSITORY_PORT,
} from 'src/modules/reviews/domain';
import { Id, PageSize, PageNumber } from 'src/modules/shared/domain';
import {
    OnlineBusinessViewRepository,
    ONLINE_BUSINESS_PORT,
    GetViewResult,
    GetViewResultStatus,
    OnlineBusinessView,
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
        private onlineBusinessViewRepository: OnlineBusinessViewRepository,
        @Inject(REVIEW_REPOSITORY_PORT)
        private reviewRepository: ReviewRepository,
    ) {}

    async filter(
        pageNumber: PageNumber,
        pageSize: PageSize,
        value?: string,
    ): Promise<FilterOnlineBusinessesResult> {
        let result: GetViewResult;
        if (value) {
            result = await this.onlineBusinessViewRepository.getByNameOrWebsite(
                value,
                pageNumber,
                pageSize,
            );
        } else {
            result = await this.onlineBusinessViewRepository.getAll(
                pageNumber,
                pageSize,
            );
        }
        if (result.status === GetViewResultStatus.GENERIC_ERROR) {
            return {
                status: OnlineBusinessReaderResultStatus.GENERIC_ERROR,
            };
        }
        if (result.status === GetViewResultStatus.NOT_FOUND) {
            return {
                status: OnlineBusinessReaderResultStatus.NOT_FOUND,
            };
        }
        return {
            status: OnlineBusinessReaderResultStatus.OK,
            onlineBusinesses: this.domainToResultDtoMapper(
                result.onlineBusinessViews,
            ),
        };
    }

    async getById(id: Id): Promise<GetOnlineBusinessByIdResult> {
        const result = await this.onlineBusinessViewRepository.getById(id);

        if (result.status === GetViewResultStatus.GENERIC_ERROR) {
            return {
                status: OnlineBusinessReaderResultStatus.GENERIC_ERROR,
            };
        }

        if (result.status === GetViewResultStatus.NOT_FOUND) {
            return {
                status: OnlineBusinessReaderResultStatus.NOT_FOUND,
            };
        }

        const business = result.onlineBusinessView;
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
        onlineBusinesses: OnlineBusinessView[],
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
