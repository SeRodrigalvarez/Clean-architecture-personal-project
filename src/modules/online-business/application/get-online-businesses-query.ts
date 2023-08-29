import { Query } from 'src/modules/shared/domain';

export class GetOnlineBusinessesQuery extends Query {
    static readonly QUERY_NAME = 'GetOnlineBusinessesQuery';

    constructor(
        readonly filter: string,
        readonly pageNumber: string,
        readonly pageSize: string,
    ) {
        super({ queryName: GetOnlineBusinessesQuery.QUERY_NAME });
    }
}
