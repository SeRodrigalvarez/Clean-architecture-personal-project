import { Query, QueryHandler, QueryResponse } from '.';

export interface QueryBus {
    ask<Q extends Query, R extends QueryResponse>(query: Q): Promise<R>;
    addHanlder(queryName: string, queryHandler: QueryHandler);
}

export const QUERY_BUS_PORT = Symbol('QUERY_BUS_PORT');
