import { Query } from 'src/modules/shared/domain';

export class GetPhysicalBusinessesQuery extends Query {
    static readonly QUERY_NAME = 'GetPhysicalBusinessesQuery';

    constructor(
        readonly filter: string,
        readonly pageNumber: string,
        readonly pageSize: string,
    ) {
        super({ queryName: GetPhysicalBusinessesQuery.QUERY_NAME });
    }
}
