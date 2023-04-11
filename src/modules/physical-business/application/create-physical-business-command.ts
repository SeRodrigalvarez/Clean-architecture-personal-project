export class CreatePhysicalBusinessCommand {
    constructor(
        public readonly name: string,
        public readonly street: string,
        public readonly city: string,
        public readonly postalCode: string,
        public readonly country: string,
        public readonly phone: string,
        public readonly email: string,
    ) {}
}
