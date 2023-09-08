import { Query } from 'src/modules/shared/domain';

export class GetOnlineBusinessesQuery extends Query {
    constructor(
        readonly filter: string,
        readonly pageNumber: string,
        readonly pageSize: string,
    ) {
        super({ queryName: GetOnlineBusinessesQuery.name });
    }
}
