import { Query } from 'src/modules/shared/domain';

export class GetPhysicalBusinessByIdQuery extends Query {
    static readonly QUERY_NAME = 'GetPhysicalBusinessByIdQuery';

    constructor(readonly id: string) {
        super({ queryName: GetPhysicalBusinessByIdQuery.QUERY_NAME });
    }
}
