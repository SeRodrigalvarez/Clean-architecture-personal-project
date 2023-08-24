import { PageNumber, PageSize, Id } from 'src/modules/shared/domain';
import {
    GetSingleViewResult,
    GetViewResult,
    GetViewResultStatus,
    OnlineBusinessName,
    OnlineBusinessView,
    OnlineBusinessViewRepository,
    OnlineBusinessWebsite,
    SaveViewResult,
    SaveViewResultStatus,
} from '../domain';

export class InMemoryOnlineBusinessViewAdapter
    implements OnlineBusinessViewRepository
{
    private businesses: OnlineBusinessView[] = [];

    async save(
        onlineBusinessView: OnlineBusinessView,
    ): Promise<SaveViewResult> {
        const collisionResult = await this.businessCollisionCheck(
            onlineBusinessView.name,
            onlineBusinessView.website,
        );
        if (collisionResult.isCollision) {
            return {
                status: SaveViewResultStatus.BUSINESS_ALREADY_EXISTS,
                isNameCollision: collisionResult.isNameCollision,
                isWebsiteCollision: collisionResult.isWebsiteCollision,
            };
        }
        this.businesses.push(onlineBusinessView);
        return {
            status: SaveViewResultStatus.OK,
        };
    }

    async getByNameOrWebsite(
        value: string,
        pageNumber: PageNumber,
        pageSize: PageSize,
    ): Promise<GetViewResult> {
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
                status: GetViewResultStatus.NOT_FOUND,
            };
        }
        return {
            status: GetViewResultStatus.OK,
            onlineBusinessViews: result,
        };
    }

    async getById(id: Id): Promise<GetSingleViewResult> {
        const result = this.businesses.find((business) => business.hasId(id));
        if (result) {
            return {
                status: GetViewResultStatus.OK,
                onlineBusinessView: result,
            };
        }
        return {
            status: GetViewResultStatus.NOT_FOUND,
        };
    }

    async getAll(
        pageNumber: PageNumber,
        pageSize: PageSize,
    ): Promise<GetViewResult> {
        const start = pageNumber.value * pageSize.value;
        const end = start + pageSize.value;
        const result = this.businesses.slice(start, end);
        if (this.businesses.length === 0) {
            return {
                status: GetViewResultStatus.NOT_FOUND,
            };
        }
        return {
            status: GetViewResultStatus.OK,
            onlineBusinessViews: result,
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
