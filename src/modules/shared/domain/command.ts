export abstract class Command {
    readonly eventName: string;

    constructor(eventName: string) {
        this.eventName = eventName;
    }
}
