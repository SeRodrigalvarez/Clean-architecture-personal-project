import {
    Controller,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Query,
} from '@nestjs/common';
import { IsString, IsOptional, IsUUID } from 'class-validator';
import {
    OnlineBusinessReader,
    OnlineBusinessReaderResultStatus,
} from 'src/modules/online-business/application';
import {
    OnlineBusiness,
    OnlineBusinessName,
} from 'src/modules/online-business/domain';
import { Id } from 'src/modules/shared/domain';

export class FilterOnlineBusinessesQuery {
    @IsOptional()
    @IsString()
    filter: string;
}

export class GetOnlineBusinesssParam {
    @IsUUID()
    id: string;
}

@Controller('business/online')
export class GetOnlineBusinessController {
    constructor(private onlineBusinessReader: OnlineBusinessReader) {}

    @Get()
    filter(@Query() query: FilterOnlineBusinessesQuery) {
        const result = this.onlineBusinessReader.filter(query.filter);

        if (result.status === OnlineBusinessReaderResultStatus.GENERIC_ERROR) {
            throw new InternalServerErrorException();
        }

        if (result.status === OnlineBusinessReaderResultStatus.NOT_FOUND) {
            throw new NotFoundException(
                'No online businesses found with the given filters',
            );
        }
        return this.domainToJsonMapper(result.onlineBusinesses);
    }

    @Get(':id')
    getById(@Param() param: GetOnlineBusinesssParam) {
        const result = this.onlineBusinessReader.getById(
            Id.createIdFrom(param.id),
        );

        if (result.status === OnlineBusinessReaderResultStatus.GENERIC_ERROR) {
            throw new InternalServerErrorException();
        }

        if (result.status === OnlineBusinessReaderResultStatus.NOT_FOUND) {
            throw new NotFoundException(
                `No online business with id: ${param.id}`,
            );
        }

        const business = result.onlineBusiness;

        return {
            id: business.id,
            name: business.name,
            website: business.website,
            email: business.email,
            reviewAmount: business.reviewsAmount,
        };
    }

    private domainToJsonMapper(onlineBusinesses: OnlineBusiness[]) {
        return onlineBusinesses.map((business) => ({
            id: business.id,
            name: business.name,
            website: business.website,
        }));
    }
}
