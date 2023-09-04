export class GetPhysicalBusinessesQuery {
    constructor(
        readonly filter: string,
        readonly pageNumber: string,
        readonly pageSize: string,
    ) {}
}
