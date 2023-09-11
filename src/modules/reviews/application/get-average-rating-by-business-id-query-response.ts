import { QueryResponse } from 'src/modules/shared/domain';
import { GetAverageRatingByBusinessIdQuery } from '.';

export class GetAverageRatingByBusinessIdQueryResponse extends QueryResponse {
    constructor(
        // TODO: use status?
        readonly avgRating: number,
    ) {
        super({ queryName: GetAverageRatingByBusinessIdQuery.name });
    }
}
