import { IsInt, Min, validateSync } from 'class-validator';

const MIN_REVIEWS_AMOUNT = 0;

export class BusinessReviewsAmount {
    @IsInt()
    @Min(MIN_REVIEWS_AMOUNT)
    private amount: number;

    private constructor(amount: number) {
        this.amount = amount;
    }

    static createNew() {
        return new this(0);
    }

    static createFrom(amount: number) {
        const object = new this(amount);
        this.guard(object);
        return object;
    }

    private static guard(object: BusinessReviewsAmount) {
        const result = validateSync(object);
        if (result.length != 0) {
            throw new Error(
                `Invalid reviews amount: ${object.value}. Reviews amount must be an integer greater than or equal to ${MIN_REVIEWS_AMOUNT}`,
            );
        }
    }

    public increase() {
        this.amount += 1;
    }

    public decrease() {
        this.amount -= 1;
    }

    get value() {
        return this.amount;
    }
}
