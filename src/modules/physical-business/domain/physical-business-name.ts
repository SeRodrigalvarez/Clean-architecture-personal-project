import { IsString, Length, validateSync } from 'class-validator';

export const NAME_MIN_LENGTH = 1;
export const NAME_MAX_LENGTH = 50;

export class PhysicalBusinessName {
    @IsString()
    @Length(NAME_MIN_LENGTH, NAME_MAX_LENGTH)
    private name: string;

    constructor(name: string) {
        this.name = name;
        this.guard();
    }

    private guard() {
        const result = validateSync(this);
        if (result.length != 0) {
            throw new Error(
                `Invalid physical business name: ${this.name}. Name length must be between ${NAME_MIN_LENGTH} and ${NAME_MAX_LENGTH}, both included`,
            );
        }
    }

    get value() {
        return this.name;
    }

    equals(name: PhysicalBusinessName) {
        return this.name === name.value;
    }

    includes(name: PhysicalBusinessName) {
        return this.name.toLowerCase().includes(name.value.toLowerCase());
    }
}
