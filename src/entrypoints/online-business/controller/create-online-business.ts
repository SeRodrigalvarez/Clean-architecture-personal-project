import {
    Controller,
    Post,
    Body,
    Inject,
    InternalServerErrorException,
    BadRequestException,
} from '@nestjs/common';
import { IsEmail, IsString, IsUUID, IsUrl, Length } from 'class-validator';
import {
    CreateOnlineBusinessCommand,
    CreateOnlineBusinessCommandResponse,
} from 'src/modules/online-business/application';
import {
    NAME_MAX_LENGTH,
    NAME_MIN_LENGTH,
    SaveResultStatus,
} from 'src/modules/online-business/domain';
import { COMMAND_BUS_PORT, CommandBus } from 'src/modules/shared/domain';

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
        const result: CreateOnlineBusinessCommandResponse =
            await this.commandBus.execute(
                new CreateOnlineBusinessCommand(
                    body.id,
                    body.name,
                    body.website,
                    body.email,
                ),
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
