import {
    CreatePhysicalBusinessCommand,
    CreatePhysicalBusinessCommandResponse,
    PhysicalBusinessCreator,
} from '.';
import {
    BusinessEmail,
    Id,
    CommandHandler,
    COMMAND_BUS_PORT,
    CommandBus,
} from 'src/modules/shared/domain';
import {
    PhysicalBusinessName,
    PhysicalBusinessAddress,
    PhysicalBusinessPhone,
} from '../domain';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CreatePhysicalBusinessCommandHanlder
    implements
        CommandHandler<
            CreatePhysicalBusinessCommand,
            CreatePhysicalBusinessCommandResponse
        >
{
    constructor(
        private physicalBusinessCreator: PhysicalBusinessCreator,
        @Inject(COMMAND_BUS_PORT) private commandBus: CommandBus,
    ) {
        this.commandBus.addHandler(
            CreatePhysicalBusinessCommand.COMMAND_NAME,
            this,
        );
    }

    async execute(
        command: CreatePhysicalBusinessCommand,
    ): Promise<CreatePhysicalBusinessCommandResponse> {
        const result = await this.physicalBusinessCreator.execute(
            Id.createFrom(command.id),
            new PhysicalBusinessName(command.name),
            new PhysicalBusinessAddress(
                command.street,
                command.city,
                command.postalCode,
                command.country,
            ),
            new PhysicalBusinessPhone(command.phone),
            new BusinessEmail(command.email),
        );

        return new CreatePhysicalBusinessCommandResponse(
            result.status,
            result.isNameCollision,
            result.isPhoneCollision,
        );
    }
}
