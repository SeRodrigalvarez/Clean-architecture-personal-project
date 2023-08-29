import { Query } from 'src/modules/shared/domain';

export class GetOnlineBusinessByIdQuery extends Query {
    static readonly QUERY_NAME = 'GetOnlineBusinessByIdQuery';

    constructor(readonly id: string) {
        super({ queryName: GetOnlineBusinessByIdQuery.QUERY_NAME });
    }
}
