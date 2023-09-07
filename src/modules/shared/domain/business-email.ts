import { IsEmail, validateSync } from 'class-validator';

export class BusinessEmail {
    @IsEmail()
    private email: string;

    constructor(email: string) {
        this.email = email;
        this.guard();
    }

    private async guard() {
        const result = validateSync(this);
        if (result.length != 0) {
            throw new Error(
                `Invalid business email: ${this.email}. Email must be a valid email address`,
            );
        }
    }

    get value() {
        return this.email;
    }
}
