import { QueryResponse } from 'src/modules/shared/domain';
import { GetViewResultStatus } from '../domain';
import { GetReviewsByBusinessIdQuery, ReaderReview } from '.';

export class GetReviewsByBusinessIdQueryResponse extends QueryResponse {
    constructor(
        readonly status: GetViewResultStatus,
        readonly reviewViews: ReaderReview[],
    ) {
        super({ queryName: GetReviewsByBusinessIdQuery.name });
    }
}
