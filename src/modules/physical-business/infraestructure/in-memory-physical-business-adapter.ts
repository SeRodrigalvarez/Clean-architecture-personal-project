import { Id, PageSize, PageNumber } from 'src/modules/shared/domain';
import {
    PhysicalBusiness,
    PhysicalBusinessName,
    PhysicalBusinessRepository,
    CreateResultStatus,
    GetResultStatus,
    UpdateResultStatus,
} from '../domain';

export class InMemoryPhysicalBusinessAdapter
    implements PhysicalBusinessRepository
{
    private businesses: PhysicalBusiness[] = [];

    async create(physicalBusiness: PhysicalBusiness) {
        if (
            this.doesNameAlreadyExists(
                new PhysicalBusinessName(physicalBusiness.name),
            )
        ) {
            return {
                status: CreateResultStatus.BUSINESS_NAME_ALREADY_EXISTS,
            };
        }
        this.businesses.push(physicalBusiness);
        return {
            status: CreateResultStatus.OK,
        };
    }

    async getByNameOrAddress(
        value: string,
        pageNumber: PageNumber,
        pageSize: PageSize,
    ) {
        const start = pageNumber.value * pageSize.value;
        const end = start + pageSize.value;
        const result = this.businesses
            .filter(
                (business) =>
                    business.includesName(value) ||
                    business.includesAddress(value),
            )
            .slice(start, end);
        if (result.length === 0) {
            return {
                status: GetResultStatus.NOT_FOUND,
            };
        }
        return {
            status: GetResultStatus.OK,
            physicalBusinesses: result,
        };
    }

    async getById(id: Id) {
        const result = this.businesses.find((business) => business.hasId(id));
        if (result) {
            return {
                status: GetResultStatus.OK,
                physicalBusiness: result,
            };
        }
        return {
            status: GetResultStatus.NOT_FOUND,
        };
    }

    async getAll(pageNumber: PageNumber, pageSize: PageSize) {
        const start = pageNumber.value * pageSize.value;
        const end = start + pageSize.value;
        const result = this.businesses.slice(start, end);
        if (this.businesses.length === 0) {
            return {
                status: GetResultStatus.NOT_FOUND,
            };
        }
        return {
            status: GetResultStatus.OK,
            physicalBusinesses: result,
        };
    }

    async increaseReviewAmount(id: Id) {
        const result = await this.getById(id);
        if (result.status === GetResultStatus.NOT_FOUND) {
            return {
                status: UpdateResultStatus.NOT_FOUND,
            };
        }
        result.physicalBusiness.increaseReviewAmount();
        return {
            status: UpdateResultStatus.OK,
        };
    }

    private doesNameAlreadyExists(name: PhysicalBusinessName) {
        return this.businesses.some((business) => business.hasName(name));
    }
}
