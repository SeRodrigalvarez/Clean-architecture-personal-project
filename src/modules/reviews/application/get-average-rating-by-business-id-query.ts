import { Query } from 'src/modules/shared/domain';

export class GetAverageRatingByBusinessIdQuery extends Query {
    constructor(readonly businessId: string) {
        super({ queryName: GetAverageRatingByBusinessIdQuery.name });
    }
}
