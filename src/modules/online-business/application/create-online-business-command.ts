import { Command } from 'src/modules/shared/domain';

export class CreateOnlineBusinessCommand extends Command {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly website: string,
        readonly email: string,
    ) {
        super({ commandName: CreateOnlineBusinessCommand.name });
    }
}
