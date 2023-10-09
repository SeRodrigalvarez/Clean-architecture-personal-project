import { Inject, Injectable } from '@nestjs/common';
import {
    ReviewRepository,
    REVIEW_REPOSITORY_PORT,
} from 'src/modules/reviews/domain';
import { Id, PageSize, PageNumber } from 'src/modules/shared/domain';
import {
    GetResultStatus,
    PhysicalBusinessRepository,
    PHYSICAL_BUSINESS_PORT,
    GetResult,
} from '../domain';

export interface ReaderPhysicalBusiness {
    id: string;
    name: string;
    address: {
        street: string;
        city: string;
        postalCode: string;
        country: string;
    };
    phone: string;
    email: string;
    reviewsAmount: number;
}

export interface ReaderPhysicalBusinessById extends ReaderPhysicalBusiness {
    averageRating: number;
}

export interface FilterPhysicalBusinessesResult {
    status: GetResultStatus;
    physicalBusinesses?: ReaderPhysicalBusiness[];
}

export interface GetPhysicalBusinessByIdResult {
    status: GetResultStatus;
    physicalBusiness?: ReaderPhysicalBusinessById;
}

@Injectable()
export class PhysicalBusinessReader {
    constructor(
        @Inject(PHYSICAL_BUSINESS_PORT)
        private onlineBusinessRepository: PhysicalBusinessRepository,
        @Inject(REVIEW_REPOSITORY_PORT)
        private reviewRepository: ReviewRepository,
    ) {}

    async filter(
        pageNumber: PageNumber,
        pageSize: PageSize,
        value?: string,
    ): Promise<FilterPhysicalBusinessesResult> {
        let result: GetResult;
        if (value) {
            result = await this.onlineBusinessRepository.getByNameOrAddress(
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
            physicalBusinesses: result.physicalBusinesses?.map((business) =>
                business.toPrimitives(),
            ),
        };
    }

    async getById(id: Id): Promise<GetPhysicalBusinessByIdResult> {
        const result = await this.onlineBusinessRepository.getById(id);

        if (result.status !== GetResultStatus.OK) {
            return {
                status: result.status,
            };
        }

        const business = result.physicalBusiness;
        // TODO: Switch to eager calculation when a new review is created
        const averageRating =
            await this.reviewRepository.getAverageRatingByBusinessId(id);

        return {
            status: GetResultStatus.OK,
            physicalBusiness: {
                id: business.id,
                name: business.name,
                address: business.address,
                email: business.email,
                phone: business.phone,
                reviewsAmount: business.reviewsAmount,
                averageRating,
            },
        };
    }
}
