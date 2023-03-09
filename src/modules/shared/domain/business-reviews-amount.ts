export class BusinessReviewsAmount {
    private amount: number;

    constructor() {
        this.amount = 0;
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
