import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
    FilterPhysicalBusinessesResult,
    GetPhysicalBusinessesQuery,
    PhysicalBusinessReader,
} from '.';
import { PageNumber, PageSize } from 'src/modules/shared/domain';

@QueryHandler(GetPhysicalBusinessesQuery)
export class GetPhysicalBusinessesQueryHandler
    implements IQueryHandler<GetPhysicalBusinessesQuery>
{
    constructor(private physicalBusinessReader: PhysicalBusinessReader) {}

    async execute(
        query: GetPhysicalBusinessesQuery,
    ): Promise<FilterPhysicalBusinessesResult> {
        const pageNumber = query.pageNumber
            ? PageNumber.createFrom(Number(query.pageNumber))
            : PageNumber.createMinPageNumber();
        const pageSize = query.pageSize
            ? PageSize.createFrom(Number(query.pageSize))
            : PageSize.createMaxPageSize();
        return await this.physicalBusinessReader.filter(
            pageNumber,
            pageSize,
            query.filter,
        );
    }
}
