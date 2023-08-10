import { Controller, Post, Body, Inject } from '@nestjs/common';
import { IsEmail, IsString, IsUUID, IsUrl, Length } from 'class-validator';
import {
    NAME_MAX_LENGTH,
    NAME_MIN_LENGTH,
} from 'src/modules/online-business/domain';
import {
    COMMAND_BUS_PORT,
    CommandBus,
    CreateOnlineBusinessCommand,
} from 'src/modules/shared/domain/commands';

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
    constructor(@Inject(COMMAND_BUS_PORT) private commandBus: CommandBus) {}

    @Post()
    async execute(@Body() body: CreateOnlineBusinessBody) {
        /**
         * TODO: Use Querybus to check if the business is already created
         * Error:
         * throw new BadRequestException(`Business name ${body.name} already exists`,);
         */

        await this.commandBus.execute(
            new CreateOnlineBusinessCommand(
                body.id,
                body.name,
                body.website,
                body.email,
            ),
        );
        /**
         * TODO: Use Querybus to check if the business was created
         * Error: throw new InternalServerErrorException();
         */
    }
}
