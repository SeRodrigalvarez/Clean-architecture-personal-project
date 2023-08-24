import { Command } from 'src/modules/shared/domain';

export class CreatePhysicalBusinessCommand extends Command {
    static readonly COMMAND_NAME = 'CreatePhysicalBusinessCommand';

    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly street: string,
        public readonly city: string,
        public readonly postalCode: string,
        public readonly country: string,
        public readonly phone: string,
        public readonly email: string,
    ) {
        super(CreatePhysicalBusinessCommand.COMMAND_NAME);
    }
}
