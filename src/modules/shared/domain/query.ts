import { Id } from '.';

export abstract class Query {
    readonly queryId: string;
    readonly queryName: string;

    constructor(params: { queryId?: string; queryName: string }) {
        const { queryId, queryName } = params;
        this.queryId = queryId || Id.createNew().value;
        this.queryName = queryName;
    }
}
