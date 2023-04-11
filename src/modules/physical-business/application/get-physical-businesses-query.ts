export class GetPhysicalBusinessesQuery {
    constructor(
        public readonly filter: string,
        public readonly pageNumber: string,
        public readonly pageSize: string,
    ) {}
}
