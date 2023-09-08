import { QueryResponse } from 'src/modules/shared/domain';
import { GetPhysicalBusinessesQuery, ReaderPhysicalBusiness } from '.';
import { GetViewResultStatus } from '../domain';

export class GetPhysicalBusinessesQueryResponse extends QueryResponse {
    constructor(
        readonly status: GetViewResultStatus,
        readonly physicalBusinesses: ReaderPhysicalBusiness[],
    ) {
        super({ queryName: GetPhysicalBusinessesQuery.name });
    }
}
