import { IsString, Length, validateSync } from 'class-validator';

export const TEXT_MIN_LENGTH = 20;
export const TEXT_MAX_LENGTH = 500;

export class ReviewText {
    @IsString()
    @Length(TEXT_MIN_LENGTH, TEXT_MAX_LENGTH)
    private review: string;

    constructor(review: string) {
        this.review = review;
        this.guard();
    }

    private guard() {
        const result = validateSync(this);
        if (result.length != 0) {
            throw new Error(
                `Invalid review text: ${this.review}. Review text must be between ${TEXT_MIN_LENGTH} and ${TEXT_MAX_LENGTH}, both included`,
            );
        }
    }

    get value() {
        return this.review;
    }
}
