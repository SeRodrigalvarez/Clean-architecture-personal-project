import { Query } from 'src/modules/shared/domain';

export class GetReviewByIdQuery extends Query {
    constructor(readonly id: string) {
        super({ queryName: GetReviewByIdQuery.name });
    }
}
