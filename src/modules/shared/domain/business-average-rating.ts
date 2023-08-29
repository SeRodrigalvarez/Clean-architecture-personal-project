import { IsNumber, Max, Min, validateSync } from 'class-validator';
import { RATING_MIN_VALUE, RATING_MAX_VALUE } from '.';

export const RATING_MAX_DECIMAL_PLACES = 1;

export class BusinessAverageRating {
    @IsNumber({ maxDecimalPlaces: RATING_MAX_DECIMAL_PLACES })
    @Min(RATING_MIN_VALUE)
    @Max(RATING_MAX_VALUE)
    private avgRating: number;

    private constructor(avgRating: number) {
        this.avgRating = avgRating;
    }

    static createNew() {
        return new this(RATING_MIN_VALUE);
    }

    static createFrom(avgRating: number) {
        const object = new this(avgRating);
        this.guard(object);
        return object;
    }

    private static guard(object: BusinessAverageRating) {
        const result = validateSync(object);
        if (result.length != 0) {
            throw new Error(
                `Invalid average rating: ${object.avgRating}. Average rating must be an integer greater than or equal to ${RATING_MIN_VALUE} and lower than or equal to ${RATING_MAX_VALUE}, and it must have ${RATING_MAX_DECIMAL_PLACES} decimal places max`,
            );
        }
    }

    get value() {
        return this.avgRating;
    }
}
