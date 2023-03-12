import { IsInt, Max, Min, validateSync } from 'class-validator';

export const PAGE_SIZE_MIN_VALUE = 1;
export const PAGE_SIZE_MAX_VALUE = 20;

export class PageSize {
    @IsInt()
    @Min(PAGE_SIZE_MIN_VALUE)
    @Max(PAGE_SIZE_MAX_VALUE)
    private pageSize: number;

    private constructor(pageSize: number) {
        this.pageSize = pageSize;
    }

    static createMaxPageSize() {
        return new this(PAGE_SIZE_MAX_VALUE);
    }

    static createFrom(pageSize: number) {
        const object = new this(pageSize);
        PageSize.guard(object);
        return object;
    }

    private static guard(object: PageSize) {
        const result = validateSync(object);
        if (result.length != 0) {
            throw new Error(
                `Invalid page size: ${object.value}. Page size must be an integer greater than or equal to ${PAGE_SIZE_MIN_VALUE} and lower than or equal to ${PAGE_SIZE_MAX_VALUE}`,
            );
        }
    }

    get value() {
        return this.pageSize;
    }
}
