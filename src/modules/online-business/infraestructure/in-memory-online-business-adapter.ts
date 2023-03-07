import { BusinessId } from 'src/modules/shared/domain';
import {
    OnlineBusiness,
    OnlineBusinessName,
    OnlineBusinessRepository,
    CreateResultStatus,
    GetResultStatus,
} from '../domain';

export class InMemoryOnlineBusinessRepository
    implements OnlineBusinessRepository
{
    private businesses: OnlineBusiness[] = [];

    create(onlineBusiness: OnlineBusiness) {
        if (this.doesNameAlreadyExists(new OnlineBusinessName(onlineBusiness.name))) {
            return {
                status: CreateResultStatus.BUSINESS_NAME_ALREADY_EXISTS,
            };
        }
        this.businesses.push(onlineBusiness);
        return {
            status: CreateResultStatus.OK,
        };
    }

    getByName(name: OnlineBusinessName) {
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
            onlineBusinesses: result,
        };
    }

    getById(id: BusinessId) {
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

    getAll() {
        if (this.businesses.length === 0) {
            return {
                status: GetResultStatus.NOT_FOUND,
            };
        }
        return {
            status: GetResultStatus.OK,
            onlineBusinesses: this.businesses,
        };
    }

    private doesNameAlreadyExists(name: OnlineBusinessName) {
        return this.businesses.some(business => business.hasName(name))
    }
}
