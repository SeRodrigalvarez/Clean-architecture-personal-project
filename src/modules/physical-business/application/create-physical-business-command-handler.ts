import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
    PhysicalBusinessCreator,
    PhysicalBusinessCreatorResult,
    CreatePhysicalBusinessCommand,
} from '.';
import { BusinessEmail } from 'src/modules/shared/domain';
import {
    PhysicalBusinessName,
    PhysicalBusinessAddress,
    PhysicalBusinessPhone,
} from '../domain';

@CommandHandler(CreatePhysicalBusinessCommand)
export class CreatePhysicalBusinessCommandHanlder
    implements ICommandHandler<CreatePhysicalBusinessCommand>
{
    constructor(private physicalBusinessCreator: PhysicalBusinessCreator) {}

    async execute(
        command: CreatePhysicalBusinessCommand,
    ): Promise<PhysicalBusinessCreatorResult> {
        return await this.physicalBusinessCreator.execute(
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
    }
}
