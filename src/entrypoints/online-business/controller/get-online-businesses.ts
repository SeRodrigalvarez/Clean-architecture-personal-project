import {
    Controller,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Query,
} from '@nestjs/common';
import { IsString, IsUUID, Length, IsOptional } from 'class-validator';
import {
    OnlineBusinessReader,
    OnlineBusinessReaderResultStatus,
} from 'src/modules/online-business/application';
import {
    NAME_MAX_LENGTH,
    NAME_MIN_LENGTH,
    OnlineBusiness,
    OnlineBusinessName,
} from 'src/modules/online-business/domain';
import { Id } from 'src/modules/shared/domain';

export class GetOnlineBusinessQueryParams {
    @IsOptional()
    @IsString()
    @Length(NAME_MIN_LENGTH, NAME_MAX_LENGTH)
    name: string;

    @IsOptional()
    @IsUUID()
    id: string;
}

@Controller('business/online')
export class GetOnlineBusinessController {
    constructor(private onlineBusinessReader: OnlineBusinessReader) {}

    @Get()
    execute(@Query() query: GetOnlineBusinessQueryParams) {
        const id = query.id ? Id.createIdFrom(query.id) : undefined;
        const name = query.name
            ? new OnlineBusinessName(query.name)
            : undefined;
        const result = this.onlineBusinessReader.execute(id, name);

        if (result.status === OnlineBusinessReaderResultStatus.GENERIC_ERROR) {
            throw new InternalServerErrorException();
        }

        if (result.status === OnlineBusinessReaderResultStatus.NOT_FOUND) {
            throw new NotFoundException(
                'No result found with the given filters',
            );
        }
        return this.domainToJsonMapper(result.onlineBusinesses);
    }

    private domainToJsonMapper(onlineBusinesses: OnlineBusiness[]) {
        return onlineBusinesses.map((business) => ({
            id: business.id,
            name: business.name,
            website: business.website,
            email: business.email,
            reviewAmount: business.reviewsAmount,
        }));
    }
}
