import { Command } from '.';

export interface CommandHandler<C extends Command = Command> {
    execute(command: C): Promise<void>;
}
