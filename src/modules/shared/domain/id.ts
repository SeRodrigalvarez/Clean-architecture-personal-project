import { randomUUID } from 'crypto';
import { IsUUID, validateSync } from 'class-validator';

export class Id {
    @IsUUID()
    private id: string;

    private constructor(uuid: string) {
        this.id = uuid;
    }

    static createNew() {
        return new this(randomUUID());
    }

    static createFrom(uuid: string) {
        const object = new this(uuid);
        Id.guard(object);
        return object;
    }

    private static guard(object: Id) {
        const result = validateSync(object);
        if (result.length != 0) {
            throw new Error(
                `Invalid UUID id: ${object.value}. Id must be a valid UUID`,
            );
        }
    }

    get value() {
        return this.id;
    }

    equals(id: Id) {
        return this.id === id.value;
    }
}
