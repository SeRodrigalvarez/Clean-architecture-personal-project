import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
    GetOnlineBusinessByIdQuery,
    GetOnlineBusinessByIdResult,
    OnlineBusinessReader,
} from '.';
import { Id } from 'src/modules/shared/domain';

@QueryHandler(GetOnlineBusinessByIdQuery)
export class GetOnlineBusinessByIdQueryHandler
    implements IQueryHandler<GetOnlineBusinessByIdQuery>
{
    constructor(private onlineBusinessReader: OnlineBusinessReader) {}

    async execute(
        query: GetOnlineBusinessByIdQuery,
    ): Promise<GetOnlineBusinessByIdResult> {
        return await this.onlineBusinessReader.getById(Id.createFrom(query.id));
    }
}
