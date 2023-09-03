import { Command, CommandResponse } from '.';

export interface CommandHandler<
    C extends Command = Command,
    R extends CommandResponse = CommandResponse,
> {
    execute(command: C): Promise<R>;
}
