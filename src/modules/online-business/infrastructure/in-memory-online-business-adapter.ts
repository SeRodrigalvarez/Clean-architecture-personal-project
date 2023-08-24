import {
    OnlineBusiness,
    OnlineBusinessName,
    OnlineBusinessRepository,
    OnlineBusinessWebsite,
    SaveResultStatus,
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
