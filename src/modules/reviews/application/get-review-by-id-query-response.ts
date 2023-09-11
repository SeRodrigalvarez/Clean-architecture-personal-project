import { QueryResponse } from 'src/modules/shared/domain';
import { GetViewResultStatus } from '../domain';
import { GetReviewByIdQuery, ReaderReview } from '.';

export class GetReviewByIdQueryResponse extends QueryResponse {
    constructor(
        readonly status: GetViewResultStatus,
        readonly reviewView: ReaderReview,
    ) {
        super({ queryName: GetReviewByIdQuery.name });
    }
}
