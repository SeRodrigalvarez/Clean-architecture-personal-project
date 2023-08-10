import { Command } from '.';

export interface CommandHandler {
    execute(command: Command): Promise<void>;
}
