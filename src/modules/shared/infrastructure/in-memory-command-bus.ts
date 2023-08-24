import { Command, CommandBus, CommandHandler } from '../domain';

export class InMemoryCommandBus implements CommandBus {
    private commandHandlers: Map<string, CommandHandler> = new Map();

    execute(command: Command) {
        this.commandHandlers.get(command.eventName).execute(command);
    }
    addHandler(commandName: string, commandHandler: CommandHandler) {
        this.commandHandlers.set(commandName, commandHandler);
    }
}
