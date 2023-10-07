import {
    Controller,
    Post,
    Body,
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common';
import { IsEmail, IsString, IsUUID, IsUrl, Length } from 'class-validator';
import { OnlineBusinessCreator } from 'src/modules/online-business/application';
import {
    NAME_MAX_LENGTH,
    NAME_MIN_LENGTH,
    OnlineBusinessName,
    OnlineBusinessWebsite,
    SaveResultStatus,
} from 'src/modules/online-business/domain';
import { BusinessEmail, Id } from 'src/modules/shared/domain';

export class CreateOnlineBusinessBody {
    @IsUUID()
    id: string;

    @IsString()
    @Length(NAME_MIN_LENGTH, NAME_MAX_LENGTH)
    name: string;

    @IsUrl()
    website: string;

    @IsEmail()
    email: string;
}

@Controller('business/online')
export class CreateOnlineBusinessController {
    constructor(private onlineBusinessCreator: OnlineBusinessCreator) {}

    @Post()
    async execute(@Body() body: CreateOnlineBusinessBody) {
        const result = await this.onlineBusinessCreator.execute(
            Id.createFrom(body.id),
            new OnlineBusinessName(body.name),
            new OnlineBusinessWebsite(body.website),
            new BusinessEmail(body.email),
        );

        if (result.status === SaveResultStatus.BUSINESS_ALREADY_EXISTS) {
            throw new BadRequestException(
                `Business with${
                    result.isNameCollision ? ` name ${body.name}` : ''
                }${
                    result.isNameCollision && result.isWebsiteCollision
                        ? ' and'
                        : ''
                }${
                    result.isWebsiteCollision ? ` website ${body.website}` : ''
                } already exists`,
            );
        }

        if (result.status === SaveResultStatus.GENERIC_ERROR) {
            throw new InternalServerErrorException();
        }
    }
}
