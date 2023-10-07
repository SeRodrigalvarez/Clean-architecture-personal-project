import { Id, PageSize, PageNumber } from 'src/modules/shared/domain';
import {
    OnlineBusiness,
    OnlineBusinessName,
    OnlineBusinessRepository,
    GetResultStatus,
    UpdateResultStatus,
    SaveResultStatus,
    OnlineBusinessWebsite,
} from '../domain';

export class InMemoryOnlineBusinessAdapter implements OnlineBusinessRepository {
    private businesses: OnlineBusiness[] = [];

    async save(onlineBusiness: OnlineBusiness) {
        const collisionResult = await this.businessCollisionCheck(
            onlineBusiness.name,
            onlineBusiness.website,
        );
        if (collisionResult.isCollision) {
            return {
                status: SaveResultStatus.BUSINESS_ALREADY_EXISTS,
                isNameCollision: collisionResult.isNameCollision,
                isWebsiteCollision: collisionResult.isWebsiteCollision,
            };
        }
        this.businesses.push(onlineBusiness);
        return {
            status: SaveResultStatus.OK,
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

    private async businessCollisionCheck(name: string, website: string) {
        const isNameCollision = this.businesses.some((business) =>
            business.hasName(new OnlineBusinessName(name)),
        );
        const isWebsiteCollision = this.businesses.some((business) =>
            business.hasWebsite(new OnlineBusinessWebsite(website)),
        );

        return {
            isCollision: isNameCollision || isWebsiteCollision,
            isNameCollision,
            isWebsiteCollision,
        };
    }
}
