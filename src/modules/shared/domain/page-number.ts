import { IsInt, Min, validateSync } from 'class-validator';

export const PAGE_NUMBER_MIN_VALUE = 0;

export class PageNumber {
    @IsInt()
    @Min(PAGE_NUMBER_MIN_VALUE)
    private pageNum: number;

    private constructor(pageNum: number) {
        this.pageNum = pageNum;
    }

    static createMinPageNumber() {
        return new this(PAGE_NUMBER_MIN_VALUE);
    }

    static createPageNumber(pageNum: number) {
        const object = new this(pageNum);
        PageNumber.guard(object);
        return object;
    }

    private static guard(object: PageNumber) {
        const result = validateSync(object);
        console.log(result);
        if (result.length != 0) {
            throw new Error(
                `Invalid page number: ${object.value}. Page number must be an integer greater than or equal to ${PAGE_NUMBER_MIN_VALUE}`,
            );
        }
    }

    get value() {
        return this.pageNum;
    }
}
