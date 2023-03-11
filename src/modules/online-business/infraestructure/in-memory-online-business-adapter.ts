import { Id, PageSize, PageNumber } from 'src/modules/shared/domain';
import {
    OnlineBusiness,
    OnlineBusinessName,
    OnlineBusinessRepository,
    CreateResultStatus,
    GetResultStatus,
    UpdateResultStatus,
} from '../domain';

export class InMemoryOnlineBusinessAdapter implements OnlineBusinessRepository {
    private businesses: OnlineBusiness[] = [];

    async create(onlineBusiness: OnlineBusiness) {
        if (
            this.doesNameAlreadyExists(
                new OnlineBusinessName(onlineBusiness.name),
            )
        ) {
            return {
                status: CreateResultStatus.BUSINESS_NAME_ALREADY_EXISTS,
            };
        }
        this.businesses.push(onlineBusiness);
        return {
            status: CreateResultStatus.OK,
        };
    }

    async getByNameOrWebsite(
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
                    business.includesWebsite(value),
            )
            .slice(start, end);
        if (result.length === 0) {
            return {
                status: GetResultStatus.NOT_FOUND,
            };
        }
        return {
            status: GetResultStatus.OK,
            onlineBusinesses: result,
        };
    }

    async getById(id: Id) {
        const result = this.businesses.find((business) => business.hasId(id));
        if (result) {
            return {
                status: GetResultStatus.OK,
                onlineBusiness: result,
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
            onlineBusinesses: result,
        };
    }

    async increaseReviewAmount(id: Id) {
        const result = await this.getById(id);
        if (result.status === GetResultStatus.NOT_FOUND) {
            return {
                status: UpdateResultStatus.NOT_FOUND,
            };
        }
        result.onlineBusiness.increaseReviewAmount();
        return {
            status: UpdateResultStatus.OK,
        };
    }

    private doesNameAlreadyExists(name: OnlineBusinessName) {
        return this.businesses.some((business) => business.hasName(name));
    }
}
