import { IsInt, Max, Min, validateSync } from 'class-validator';

export const RATING_MIN_VALUE = 1;
export const RATING_MAX_VALUE = 5;

export class ReviewRating {
    @IsInt()
    @Min(RATING_MIN_VALUE)
    @Max(RATING_MAX_VALUE)
    private rating: number;

    constructor(rating: number) {
        this.rating = rating;
        this.guard();
    }

    private guard() {
        const result = validateSync(this);
        if (result.length != 0) {
            throw new Error(
                `Invalid review rating: ${this.rating}. Review rating must be an integer greater than or equal to ${RATING_MIN_VALUE} and lower than or equal to ${RATING_MAX_VALUE}`,
            );
        }
    }

    get value() {
        return this.rating;
    }
}
