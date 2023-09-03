import { Id } from '.';

export abstract class Command {
    readonly commandId: string;
    readonly commandName: string;

    constructor(params: { commandId?: string; commandName: string }) {
        const { commandId, commandName } = params;
        this.commandId = commandId || Id.createNew().value;
        this.commandName = commandName;
    }
}
