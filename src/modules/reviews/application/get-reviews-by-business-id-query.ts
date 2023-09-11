import { Query } from 'src/modules/shared/domain';

export class GetReviewsByBusinessIdQuery extends Query {
    constructor(
        readonly businessId: string,
        readonly pageNumber: string,
        readonly pageSize: string,
    ) {
        super({ queryName: GetReviewsByBusinessIdQuery.name });
    }
}
