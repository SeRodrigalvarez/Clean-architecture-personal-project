import {
    Controller,
    Post,
    Body,
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { IsEmail, IsString, IsUrl, Length } from 'class-validator';
import {
    CreateOnlineBusinessCommand,
    OnlineBusinessCreatorResult,
    OnlineBusinessCreatorResultStatus,
} from 'src/modules/online-business/application';
import {
    NAME_MAX_LENGTH,
    NAME_MIN_LENGTH,
} from 'src/modules/online-business/domain';

export class CreateOnlineBusinessBody {
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
    constructor(private commandBus: CommandBus) {}

    @Post()
    async execute(@Body() body: CreateOnlineBusinessBody) {
        const result: OnlineBusinessCreatorResult =
            await this.commandBus.execute(
                new CreateOnlineBusinessCommand(
                    body.name,
                    body.website,
                    body.email,
                ),
            );

        if (
            result.status ===
            OnlineBusinessCreatorResultStatus.BUSINESS_NAME_ALREADY_EXISTS
        ) {
            throw new BadRequestException(
                `Business name ${body.name} already exists`,
            );
        }
        if (result.status === OnlineBusinessCreatorResultStatus.GENERIC_ERROR) {
            throw new InternalServerErrorException();
        }
        return {
            id: result.id,
        };
    }
}
