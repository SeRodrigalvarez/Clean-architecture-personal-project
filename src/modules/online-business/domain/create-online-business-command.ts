import { Command } from 'src/modules/shared/domain';

export class CreateOnlineBusinessCommand extends Command {
    static readonly COMMAND_NAME = 'CreateOnlineBusinessCommand';

    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly website: string,
        public readonly email: string,
    ) {
        super(CreateOnlineBusinessCommand.COMMAND_NAME);
    }
}
