import {
    PhysicalBusiness,
    PhysicalBusinessName,
    PhysicalBusinessRepository,
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
