import { Query } from 'src/modules/shared/domain';

export class GetPhysicalBusinessesQuery extends Query {
    constructor(
        readonly filter: string,
        readonly pageNumber: string,
        readonly pageSize: string,
    ) {
        super({ queryName: GetPhysicalBusinessesQuery.name });
    }
}
