import { IsUrl, validateSync } from 'class-validator';

export class OnlineBusinessWebsite {
    @IsUrl()
    private website: string;

    constructor(website: string) {
        this.website = website;
        this.guard();
    }

    private async guard() {
        const result = validateSync(this);
        if (result.length != 0) {
            throw new Error(
                `Invalid online business website: ${this.website}. Website must be a valid URL address`,
            );
        }
    }

    get value() {
        return this.website;
    }

    includes(value: string) {
        return this.website.toLowerCase().includes(value.toLowerCase());
    }
}
