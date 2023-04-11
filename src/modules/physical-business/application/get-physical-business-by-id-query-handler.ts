import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
    GetPhysicalBusinessByIdQuery,
    GetPhysicalBusinessByIdResult,
    PhysicalBusinessReader,
} from '.';
import { Id } from 'src/modules/shared/domain';

@QueryHandler(GetPhysicalBusinessByIdQuery)
export class GetPhysicalBusinessByIdQueryHanlder
    implements IQueryHandler<GetPhysicalBusinessByIdQuery>
{
    constructor(private physicalBusinessReader: PhysicalBusinessReader) {}

    async execute(
        query: GetPhysicalBusinessByIdQuery,
    ): Promise<GetPhysicalBusinessByIdResult> {
        return await this.physicalBusinessReader.getById(
            Id.createFrom(query.id),
        );
    }
}
