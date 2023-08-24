import { Command, CommandHandler } from '.';

export interface CommandBus {
    execute(command: Command);
    addHandler(commandName: string, commandHandler: CommandHandler);
}

export const COMMAND_BUS_PORT = Symbol('COMMAND_BUS_PORT');
