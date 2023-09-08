import { Query } from 'src/modules/shared/domain';

export class GetPhysicalBusinessByIdQuery extends Query {
    constructor(readonly id: string) {
        super({ queryName: GetPhysicalBusinessByIdQuery.name });
    }
}
