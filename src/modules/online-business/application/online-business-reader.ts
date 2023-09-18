import { Inject, Injectable } from '@nestjs/common';
import { Id, PageSize, PageNumber } from 'src/modules/shared/domain';
import {
    OnlineBusinessViewRepository,
    GetViewResult,
    GetViewResultStatus,
    ONLINE_BUSINESS_VIEW_PORT,
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
    status: GetViewResultStatus;
    onlineBusinesses?: ReaderOnlineBusiness[];
}

export interface GetOnlineBusinessByIdResult {
    status: GetViewResultStatus;
    onlineBusiness?: ReaderOnlineBusinessById;
}

@Injectable()
export class OnlineBusinessReader {
    constructor(
        @Inject(ONLINE_BUSINESS_VIEW_PORT)
        private onlineBusinessViewRepository: OnlineBusinessViewRepository,
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
        return {
            status: result.status,
            onlineBusinesses: result.onlineBusinessViews?.map((business) => ({
                id: business.id,
                name: business.name,
                website: business.website,
                email: business.email,
                reviewsAmount: business.reviewsAmount,
            })),
        };
    }

    async getById(id: Id): Promise<GetOnlineBusinessByIdResult> {
        const result = await this.onlineBusinessViewRepository.getById(id);

        return {
            status: result.status,
            onlineBusiness: result.onlineBusinessView?.toPrimitives(),
        };
    }
}
