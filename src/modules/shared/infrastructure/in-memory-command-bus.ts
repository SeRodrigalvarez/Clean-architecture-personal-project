import { Command, CommandBus, CommandHandler } from '../domain';

export class InMemoryCommandBus implements CommandBus {
    private commandHandlers: Map<Command, CommandHandler> = new Map();

    execute(command: Command) {
        this.commandHandlers.get(command.constructor).execute(command);
    }
    addHandler(command: Command, commandHandler: CommandHandler) {
        this.commandHandlers.set(command, commandHandler);
    }
}
