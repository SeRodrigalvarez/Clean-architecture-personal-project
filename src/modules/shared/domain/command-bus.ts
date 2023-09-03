import { Command, CommandHandler, CommandResponse } from '.';

export interface CommandBus {
    execute<C extends Command, R extends CommandResponse>(
        command: C,
    ): Promise<R>;
    addHandler(commandName: string, commandHandler: CommandHandler);
}

export const COMMAND_BUS_PORT = Symbol('COMMAND_BUS_PORT');
