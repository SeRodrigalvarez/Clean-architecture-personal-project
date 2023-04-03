import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
    GetOnlineBusinessByIdQuery,
    OnlineBusinessReader,
    OnlineBusinessReaderResultStatus,
} from '.';
import { Id } from 'src/modules/shared/domain';

export interface OnlineBusinessQueryResult {
    id: string;
    name: string;
    website: string;
    email: string;
    reviewsAmount: number;
    averageRating: number;
}

export interface GetOnlineBusinessByIdQueryResult {
    status: GetOnlineBusinessByIdQueryResultStatus;
    onlineBusiness?: OnlineBusinessQueryResult;
}

export enum GetOnlineBusinessByIdQueryResultStatus {
    OK,
    NOT_FOUND,
    GENERIC_ERROR,
}

@QueryHandler(GetOnlineBusinessByIdQuery)
export class GetOnlineBusinessByIdQueryHandler
    implements IQueryHandler<GetOnlineBusinessByIdQuery>
{
    constructor(private onlineBusinessReader: OnlineBusinessReader) {}

    async execute(
        query: GetOnlineBusinessByIdQuery,
    ): Promise<GetOnlineBusinessByIdQueryResult> {
        const result = await this.onlineBusinessReader.getById(
            Id.createFrom(query.id),
        );

        if (result.status === OnlineBusinessReaderResultStatus.GENERIC_ERROR) {
            return {
                status: GetOnlineBusinessByIdQueryResultStatus.GENERIC_ERROR,
            };
        }

        if (result.status === OnlineBusinessReaderResultStatus.NOT_FOUND) {
            return {
                status: GetOnlineBusinessByIdQueryResultStatus.NOT_FOUND,
            };
        }

        return {
            status: GetOnlineBusinessByIdQueryResultStatus.OK,
            onlineBusiness: result.onlineBusiness,
        };
    }
}
