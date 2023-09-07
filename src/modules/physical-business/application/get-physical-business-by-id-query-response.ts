import { QueryResponse } from 'src/modules/shared/domain';
import { GetPhysicalBusinessByIdQuery, ReaderPhysicalBusinessById } from '.';
import { GetViewResultStatus } from '../domain';

export class GetPhysicalBusinessByIdQueryResponse extends QueryResponse {
    constructor(
        readonly status: GetViewResultStatus,
        readonly physicalBusiness: ReaderPhysicalBusinessById,
    ) {
        super({ queryName: GetPhysicalBusinessByIdQuery.QUERY_NAME });
    }
}
