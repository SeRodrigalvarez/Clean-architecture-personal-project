import { Inject, Injectable } from '@nestjs/common';
import {
    ReviewRepository,
    REVIEW_REPOSITORY_PORT,
} from 'src/modules/reviews/domain';
import { Id, PageSize, PageNumber } from 'src/modules/shared/domain';
import {
    GetResultStatus,
    PhysicalBusiness,
    PhysicalBusinessRepository,
    PHYSICAL_BUSINESS_PORT,
} from '../domain';

export interface ReaderPhysicalBusiness {
    id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    reviewsAmount: number;
    averageRating: number;
}

export interface FilterPhysicalBusinessesResult {
    status: PhysicalBusinessReaderResultStatus;
    physicalBusinesses?: PhysicalBusiness[];
}

export interface GetPhysicalBusinessByIdResult {
    status: PhysicalBusinessReaderResultStatus;
    physicalBusiness?: ReaderPhysicalBusiness;
}

export enum PhysicalBusinessReaderResultStatus {
    OK,
    NOT_FOUND,
    GENERIC_ERROR,
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
        let result;
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
        if (result.status === GetResultStatus.GENERIC_ERROR) {
            return {
                status: PhysicalBusinessReaderResultStatus.GENERIC_ERROR,
            };
        }
        if (result.status === GetResultStatus.NOT_FOUND) {
            return {
                status: PhysicalBusinessReaderResultStatus.NOT_FOUND,
            };
        }
        return {
            status: PhysicalBusinessReaderResultStatus.OK,
            physicalBusinesses: result.physicalBusinesses,
        };
    }

    async getById(id: Id): Promise<GetPhysicalBusinessByIdResult> {
        const result = await this.onlineBusinessRepository.getById(id);

        if (result.status === GetResultStatus.GENERIC_ERROR) {
            return {
                status: PhysicalBusinessReaderResultStatus.GENERIC_ERROR,
            };
        }

        if (result.status === GetResultStatus.NOT_FOUND) {
            return {
                status: PhysicalBusinessReaderResultStatus.NOT_FOUND,
            };
        }

        const business = result.physicalBusiness;
        const averageRating =
            await this.reviewRepository.getAverageRatingByBusinessId(id);

        return {
            status: PhysicalBusinessReaderResultStatus.OK,
            physicalBusiness: {
                id: business.id,
                name: business.name,
                address: business.addressString,
                email: business.email,
                phone: business.phone,
                reviewsAmount: business.reviewsAmount,
                averageRating,
            },
        };
    }
}
