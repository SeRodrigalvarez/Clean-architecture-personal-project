export class CreateOnlineBusinessCommand {
    constructor(
        public readonly name: string,
        public readonly website: string,
        public readonly email: string,
    ) {}
}
