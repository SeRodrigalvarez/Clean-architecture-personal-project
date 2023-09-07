import { Id, PageSize, PageNumber } from 'src/modules/shared/domain';
import {
    GetSingleViewResult,
    GetViewResult,
    GetViewResultStatus,
    PhysicalBusinessView,
    PhysicalBusinessViewRepository,
    SaveViewResult,
    SaveViewResultStatus,
} from '../domain';

export class InMemoryPhysicalBusinessViewAdapter
    implements PhysicalBusinessViewRepository
{
    private businesses: PhysicalBusinessView[] = [];

    async save(
        physicalBusinessView: PhysicalBusinessView,
    ): Promise<SaveViewResult> {
        this.businesses.push(physicalBusinessView);
        return {
            status: SaveViewResultStatus.OK,
        };
    }

    async getByNameOrAddress(
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
                    business.includesAddress(value),
            )
            .slice(start, end);
        if (result.length === 0) {
            return {
                status: GetViewResultStatus.NOT_FOUND,
            };
        }
        return {
            status: GetViewResultStatus.OK,
            physicalBusinessViews: result,
        };
    }

    async getById(id: Id): Promise<GetSingleViewResult> {
        const result = this.businesses.find((business) => business.hasId(id));
        if (result) {
            return {
                status: GetViewResultStatus.OK,
                physicalBusinessView: result,
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
            physicalBusinessViews: result,
        };
    }
}
