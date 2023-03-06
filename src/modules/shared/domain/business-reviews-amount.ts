export class BusinessReviewsAmount {
    private amount: bigint;

    constructor() {
        this.amount = 0n;
    }

    public increase() {
        this.amount += 1n;
    }

    public decrease() {
        this.amount -= 1n;
    }

    get value() {
        return this.amount;
    }
}
