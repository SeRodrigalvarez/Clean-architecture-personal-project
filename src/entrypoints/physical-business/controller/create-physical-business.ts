import { Controller, Post, Body, Inject } from '@nestjs/common';
import {
    IsEmail,
    IsISO31661Alpha3,
    IsString,
    IsUUID,
    Length,
} from 'class-validator';
import {
    CITY_MAX_LENGTH,
    CITY_MIN_LENGTH,
    NAME_MAX_LENGTH,
    NAME_MIN_LENGTH,
    POSTAL_CODE_MAX_LENGTH,
    POSTAL_CODE_MIN_LENGTH,
    STREET_MAX_LENGTH,
    STREET_MIN_LENGTH,
    PHONE_MAX_LENGTH,
    PHONE_MIN_LENGTH,
    CreatePhysicalBusinessCommand,
} from 'src/modules/physical-business/domain';
import { COMMAND_BUS_PORT, CommandBus } from 'src/modules/shared/domain';

export class CreatePhysicalBusinessBody {
    @IsUUID()
    id: string;

    @IsString()
    @Length(NAME_MIN_LENGTH, NAME_MAX_LENGTH)
    name: string;

    @IsString()
    @Length(STREET_MIN_LENGTH, STREET_MAX_LENGTH)
    street: string;

    @IsString()
    @Length(CITY_MIN_LENGTH, CITY_MAX_LENGTH)
    city: string;

    @IsString()
    @Length(POSTAL_CODE_MIN_LENGTH, POSTAL_CODE_MAX_LENGTH)
    postalCode: string;

    @IsISO31661Alpha3()
    country: string;

    @IsString()
    @Length(PHONE_MIN_LENGTH, PHONE_MAX_LENGTH)
    phone: string;

    @IsEmail()
    email: string;
}

@Controller('business/physical')
export class CreatePhysicalBusinessController {
    constructor(@Inject(COMMAND_BUS_PORT) private commandBus: CommandBus) {}

    @Post()
    async execute(@Body() body: CreatePhysicalBusinessBody) {
        /**
         * TODO: Use Querybus to check if the business is already created
         * Error:
         * throw new BadRequestException(`Business name ${body.name} already exists`,);
         */

        await this.commandBus.execute(
            new CreatePhysicalBusinessCommand(
                body.id,
                body.name,
                body.street,
                body.city,
                body.postalCode,
                body.country,
                body.phone,
                body.email,
            ),
        );

        /**
         * TODO: Use Querybus to check if the business was created
         * Error: throw new InternalServerErrorException();
         */
    }
}
