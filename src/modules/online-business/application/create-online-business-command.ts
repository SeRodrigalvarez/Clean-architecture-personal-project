import { Command } from 'src/modules/shared/domain';

export class CreateOnlineBusinessCommand extends Command {
    static readonly COMMAND_NAME = 'CreateOnlineBusinessCommand';

    constructor(
        readonly id: string,
        readonly name: string,
        readonly website: string,
        readonly email: string,
    ) {
        super({ commandName: CreateOnlineBusinessCommand.COMMAND_NAME });
    }
}
