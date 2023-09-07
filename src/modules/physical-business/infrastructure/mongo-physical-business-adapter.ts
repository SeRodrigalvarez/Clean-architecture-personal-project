import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Collection } from 'mongodb';
import { MongoDatabaseConnection } from 'src/modules/shared/infrastructure/mongo-database-connection';
import {
    SaveResultStatus,
    PhysicalBusiness,
    PhysicalBusinessRepository,
    SaveResult,
} from '../domain';

interface PhysicalBusinessDocument {
    id: string;
    name: string;
    address: {
        street: string;
        city: string;
        postalCode: string;
        country: string;
    };
    phone: string;
    email: string;
}

@Injectable()
export class MongoPhysicalBusinessAdapter
    implements PhysicalBusinessRepository
{
    private readonly logger = new Logger(MongoPhysicalBusinessAdapter.name);

    private collection: Collection<PhysicalBusinessDocument>;

    constructor(
        connection: MongoDatabaseConnection,
        private config: ConfigService,
    ) {
        this.collection =
            connection.database.collection<PhysicalBusinessDocument>(
                this.config.get('MONGODB_PHYSICAL_BUSINESS_COLLECTION'),
            );
    }

    async save(physicalBusiness: PhysicalBusiness): Promise<SaveResult> {
        try {
            // TODO: Use reservation pattern or unique index to avoid race condition bugs
            const collisionResult = await this.businessCollisionCheck(
                physicalBusiness.name,
                physicalBusiness.phone,
            );
            if (collisionResult.isCollision) {
                return {
                    status: SaveResultStatus.BUSINESS_ALREADY_EXISTS,
                    isNameCollision: collisionResult.isNameCollision,
                    isPhoneCollision: collisionResult.isPhoneCollision,
                };
            }
            await this.collection.replaceOne(
                { id: physicalBusiness.id },
                physicalBusiness.toPrimitives(),
                { upsert: true },
            );
            return {
                status: SaveResultStatus.OK,
            };
        } catch (error) {
            this.logger.error(error.stack);
            return {
                status: SaveResultStatus.GENERIC_ERROR,
            };
        }
    }

    private async businessCollisionCheck(name: string, phone: string) {
        const isNameCollision = !!(await this.collection.findOne({ name }));
        const isPhoneCollision = !!(await this.collection.findOne({ phone }));

        return {
            isCollision: isNameCollision || isPhoneCollision,
            isNameCollision,
            isPhoneCollision,
        };
    }
}
