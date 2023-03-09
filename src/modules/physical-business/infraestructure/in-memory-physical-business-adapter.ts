import { Id } from 'src/modules/shared/domain';
import {
    PhysicalBusiness,
    PhysicalBusinessName,
    PhysicalBusinessRepository,
    CreateResultStatus,
    GetResultStatus,
    UpdateResult,
    UpdateResultStatus,
} from '../domain';

export class InMemoryPhysicalBusinessAdapter
    implements PhysicalBusinessRepository
{
    private businesses: PhysicalBusiness[] = [];

    create(physicalBusiness: PhysicalBusiness) {
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

    getByName(name: PhysicalBusinessName) {
        const result = this.businesses.filter((business) =>
            business.includesName(name),
        );
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

    getById(id: Id) {
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

    getAll() {
        if (this.businesses.length === 0) {
            return {
                status: GetResultStatus.NOT_FOUND,
            };
        }
        return {
            status: GetResultStatus.OK,
            physicalBusinesses: this.businesses,
        };
    }

    increaseReviewAmount(id: Id): UpdateResult {
        const result = this.getById(id);
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
