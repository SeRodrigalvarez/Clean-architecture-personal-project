import { Inject, Injectable } from '@nestjs/common';
import { Id, PageSize, PageNumber } from 'src/modules/shared/domain';
import {
    PhysicalBusinessViewRepository,
    GetViewResult,
    GetViewResultStatus,
    PHYSICAL_BUSINESS_VIEW_PORT,
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
    status: GetViewResultStatus;
    physicalBusinesses?: ReaderPhysicalBusiness[];
}

export interface GetPhysicalBusinessByIdResult {
    status: GetViewResultStatus;
    physicalBusiness?: ReaderPhysicalBusinessById;
}

@Injectable()
export class PhysicalBusinessReader {
    constructor(
        @Inject(PHYSICAL_BUSINESS_VIEW_PORT)
        private physicalBusinessViewRepository: PhysicalBusinessViewRepository,
    ) {}

    async filter(
        pageNumber: PageNumber,
        pageSize: PageSize,
        value?: string,
    ): Promise<FilterPhysicalBusinessesResult> {
        let result: GetViewResult;
        if (value) {
            result =
                await this.physicalBusinessViewRepository.getByNameOrAddress(
                    value,
                    pageNumber,
                    pageSize,
                );
        } else {
            result = await this.physicalBusinessViewRepository.getAll(
                pageNumber,
                pageSize,
            );
        }
        return {
            status: result.status,
            physicalBusinesses: result.physicalBusinessViews?.map(
                (business) => ({
                    id: business.id,
                    name: business.name,
                    address: business.address,
                    email: business.email,
                    phone: business.phone,
                    reviewsAmount: business.reviewsAmount,
                }),
            ),
        };
    }

    async getById(id: Id): Promise<GetPhysicalBusinessByIdResult> {
        const result = await this.physicalBusinessViewRepository.getById(id);

        return {
            status: result.status,
            physicalBusiness: result.physicalBusinessView?.toPrimitives(),
        };
    }
}
