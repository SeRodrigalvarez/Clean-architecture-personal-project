import {
    Command,
    CommandBus,
    CommandHandler,
    CommandResponse,
} from '../domain';

export class InMemoryCommandBus implements CommandBus {
    private commandHandlers: Map<string, CommandHandler> = new Map();

    execute<C extends Command, R extends CommandResponse>(
        command: C,
    ): Promise<R> {
        return this.commandHandlers
            .get(command.commandName)
            .execute(command) as Promise<R>;
    }
    addHandler(commandName: string, commandHandler: CommandHandler) {
        this.commandHandlers.set(commandName, commandHandler);
    }
}
