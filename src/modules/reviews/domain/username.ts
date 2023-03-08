import { IsString, Length, validateSync } from 'class-validator';

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 20;

export class Username {
    @IsString()
    @Length(USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH)
    private username: string;

    constructor(username: string) {
        this.username = username;
        this.guard();
    }

    private guard() {
        const result = validateSync(this);
        if (result.length != 0) {
            throw new Error(
                `Invalid username: ${this.username}. Username length must be between ${USERNAME_MIN_LENGTH} and ${USERNAME_MAX_LENGTH}, both included`,
            );
        }
    }

    get value() {
        return this.username;
    }

    equals(username: Username) {
        return this.username === username.value;
    }
}
