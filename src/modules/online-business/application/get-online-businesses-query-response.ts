import { QueryResponse } from 'src/modules/shared/domain';
import { GetOnlineBusinessesQuery, ReaderOnlineBusiness } from '.';
import { GetViewResultStatus } from '../domain';

export class GetOnlineBusinessesQueryResponse extends QueryResponse {
    constructor(
        readonly status: GetViewResultStatus,
        readonly onlineBusinesses: ReaderOnlineBusiness[],
    ) {
        super({ queryName: GetOnlineBusinessesQuery.name });
    }
}
