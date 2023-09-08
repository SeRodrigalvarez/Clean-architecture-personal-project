import { Query } from 'src/modules/shared/domain';

export class GetOnlineBusinessByIdQuery extends Query {
    constructor(readonly id: string) {
        super({ queryName: GetOnlineBusinessByIdQuery.name });
    }
}
