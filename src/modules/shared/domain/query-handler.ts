import { Query, QueryResponse } from '.';

export interface QueryHandler<
    Q extends Query = Query,
    R extends QueryResponse = QueryResponse,
> {
    execute(query: Q): Promise<R>;
}
