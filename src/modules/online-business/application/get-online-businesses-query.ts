export class GetOnlineBusinessesQuery {
    constructor(
        public readonly filter: string,
        public readonly pageNumber: string,
        public readonly pageSize: string,
    ) {}
}
