import { DomainEvent } from 'src/modules/shared/domain';

export class PhysicalBusinessCreatedEvent extends DomainEvent {
    readonly name: string;
    readonly address: {
        street: string;
        city: string;
        postalCode: string;
        country: string;
    };
    readonly phone: string;
    readonly email: string;

    constructor(params: {
        aggregateId: string;
        name: string;
        address: {
            street: string;
            city: string;
            postalCode: string;
            country: string;
        };
        phone: string;
        email: string;
    }) {
        super({
            aggregateId: params.aggregateId,
            eventName: PhysicalBusinessCreatedEvent.name,
        });
        this.name = params.name;
        this.address = params.address;
        this.phone = params.phone;
        this.email = params.email;
    }
}