import { Command } from 'src/modules/shared/domain';

export class CreatePhysicalBusinessCommand extends Command {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly street: string,
        readonly city: string,
        readonly postalCode: string,
        readonly country: string,
        readonly phone: string,
        readonly email: string,
    ) {
        super({ commandName: CreatePhysicalBusinessCommand.name });
    }
}
