import {
    IsISO31661Alpha3,
    IsString,
    Length,
    validateSync,
} from 'class-validator';

export const STREET_MIN_LENGTH = 3;
export const STREET_MAX_LENGTH = 30;

export const CITY_MIN_LENGTH = 3;
export const CITY_MAX_LENGTH = 20;

export const POSTAL_CODE_MIN_LENGTH = 2;
export const POSTAL_CODE_MAX_LENGTH = 12;

export class PhysicalBusinessAddress {
    @IsString()
    @Length(STREET_MIN_LENGTH, STREET_MAX_LENGTH)
    private street: string;

    @IsString()
    @Length(CITY_MIN_LENGTH, CITY_MAX_LENGTH)
    private city: string;

    @IsString()
    @Length(POSTAL_CODE_MIN_LENGTH, POSTAL_CODE_MAX_LENGTH)
    private postalCode: string;

    @IsISO31661Alpha3()
    private country: string;

    constructor(
        street: string,
        city: string,
        postalCode: string,
        country: string,
    ) {
        this.street = street;
        this.city = city;
        this.postalCode = postalCode;
        this.country = country;
        this.guard();
    }

    private guard() {
        const result = validateSync(this);
        if (result.length != 0) {
            throw new Error(`Invalid address`, {
                cause: result,
            });
        }
    }

    toString() {
        return `${this.street}, ${this.postalCode} ${this.city}, ${this.country}`;
    }

    includes(value: string) {
        return this.toString().toLowerCase().includes(value.toLowerCase());
    }
}
