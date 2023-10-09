import { Id, PageSize, PageNumber } from 'src/modules/shared/domain';
import {
    PhysicalBusiness,
    PhysicalBusinessName,
    PhysicalBusinessRepository,
    GetResultStatus,
    UpdateResultStatus,
    PhysicalBusinessPhone,
    SaveResultStatus,
} from '../domain';

export class InMemoryPhysicalBusinessAdapter
    implements PhysicalBusinessRepository
{
    private businesses: PhysicalBusiness[] = [];

    async save(physicalBusiness: PhysicalBusiness) {
        const collisionResult = await this.businessCollisionCheck(
            physicalBusiness.name,
            physicalBusiness.phone,
        );
        if (collisionResult.isCollision) {
            return {
                status: SaveResultStatus.BUSINESS_ALREADY_EXISTS,
                isNameCollision: collisionResult.isNameCollision,
                isPhoneCollision: collisionResult.isPhoneCollision,
            };
        }
        this.businesses.push(physicalBusiness);
        return {
            status: SaveResultStatus.OK,
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

    private async businessCollisionCheck(name: string, phone: string) {
        const isNameCollision = this.businesses.some((business) =>
            business.hasName(new PhysicalBusinessName(name)),
        );
        const isPhoneCollision = this.businesses.some((business) =>
            business.hasPhone(new PhysicalBusinessPhone(phone)),
        );

        return {
            isCollision: isNameCollision || isPhoneCollision,
            isNameCollision,
            isPhoneCollision,
        };
    }
}
