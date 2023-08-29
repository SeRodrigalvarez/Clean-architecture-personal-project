import { Query, QueryBus, QueryHandler, QueryResponse } from '../domain';

export class InMemoryQueryBus implements QueryBus {
    private queryHandlers: Map<string, QueryHandler> = new Map();

    ask<Q extends Query, R extends QueryResponse>(query: Q): Promise<R> {
        return this.queryHandlers
            .get(query.queryName)
            .execute(query) as Promise<R>;
    }

    addHanlder(queryName: string, queryHandler: QueryHandler) {
        this.queryHandlers.set(queryName, queryHandler);
    }
}
