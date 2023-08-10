export class CreateOnlineBusinessCommand {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly website: string,
        public readonly email: string,
    ) {}
}
