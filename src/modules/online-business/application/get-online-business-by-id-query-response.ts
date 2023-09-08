import { QueryResponse } from 'src/modules/shared/domain';
import { GetViewResultStatus } from '../domain';
import { GetOnlineBusinessByIdQuery, ReaderOnlineBusinessById } from '.';

export class GetOnlineBusinessByIdQueryResponse extends QueryResponse {
    constructor(
        readonly status: GetViewResultStatus,
        readonly onlineBusiness: ReaderOnlineBusinessById,
    ) {
        super({ queryName: GetOnlineBusinessByIdQuery.name });
    }
}
