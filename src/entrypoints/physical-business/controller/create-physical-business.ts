import {
    Controller,
    Post,
    Body,
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common';
import { IsEmail, IsISO31661Alpha3, IsString, Length } from 'class-validator';
import {
    PhysicalBusinessCreator,
    PhysicalBusinessCreatorResultStatus,
} from 'src/modules/physical-business/application';
import {
    PhysicalBusinessName,
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
    PhysicalBusinessAddress,
    PhysicalBusinessPhone,
} from 'src/modules/physical-business/domain';
import { BusinessEmail } from 'src/modules/shared/domain';

export class CreatePhysicalBusinessBody {
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
    constructor(private physicalBusinessCreator: PhysicalBusinessCreator) {}

    @Post()
    execute(@Body() body: CreatePhysicalBusinessBody) {
        const result = this.physicalBusinessCreator.execute(
            new PhysicalBusinessName(body.name),
            new PhysicalBusinessAddress(
                body.street,
                body.city,
                body.postalCode,
                body.country,
            ),
            new PhysicalBusinessPhone(body.phone),
            new BusinessEmail(body.email),
        );

        if (
            result.status ===
            PhysicalBusinessCreatorResultStatus.BUSINESS_NAME_ALREADY_EXISTS
        ) {
            throw new BadRequestException(
                `Business name ${body.name} already exists`,
            );
        }
        if (
            result.status === PhysicalBusinessCreatorResultStatus.GENERIC_ERROR
        ) {
            throw new InternalServerErrorException();
        }
    }
}
