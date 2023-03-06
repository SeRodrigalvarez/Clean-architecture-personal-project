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
        const result = this.getByName(
            new OnlineBusinessName(onlineBusiness.name),
        );
        if (result.status === GetResultStatus.OK) {
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
        const result = this.businesses.find((business) =>
            business.hasName(name),
        );
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
}
