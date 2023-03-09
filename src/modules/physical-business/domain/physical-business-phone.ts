import { IsString, Length, validateSync } from 'class-validator';

export const PHONE_MIN_LENGTH = 6;
export const PHONE_MAX_LENGTH = 15;

export class PhysicalBusinessPhone {
    @IsString()
    @Length(PHONE_MIN_LENGTH, PHONE_MAX_LENGTH)
    private phone: string;

    constructor(phone: string) {
        this.phone = phone;
        this.guard();
    }

    private async guard() {
        const result = validateSync(this);
        if (result.length != 0) {
            throw new Error(
                `Invalid physical business phone: ${this.phone}. Phone length must be between ${PHONE_MIN_LENGTH} and ${PHONE_MAX_LENGTH}, both included`,
            );
        }
    }

    get value() {
        return this.phone;
    }
}
