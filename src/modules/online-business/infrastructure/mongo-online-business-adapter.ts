import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Collection } from 'mongodb';
import { MongoDatabaseConnection } from 'src/modules/shared/infrastructure/mongo-database-connection';
import {
    OnlineBusiness,
    OnlineBusinessRepository,
    SaveResult,
    SaveResultStatus,
} from '../domain';

interface OnlineBusinessDocument {
    id: string;
    name: string;
    website: string;
    email: string;
}

@Injectable()
export class MongoOnlineBusinessAdapter implements OnlineBusinessRepository {
    private readonly logger = new Logger(MongoOnlineBusinessAdapter.name);

    private collection: Collection<OnlineBusinessDocument>;

    constructor(
        connection: MongoDatabaseConnection,
        private config: ConfigService,
    ) {
        this.collection =
            connection.database.collection<OnlineBusinessDocument>(
                this.config.get('MONGODB_ONLINE_BUSINESS_COLLECTION'),
            );
    }

    async save(onlineBusiness: OnlineBusiness): Promise<SaveResult> {
        try {
            // TODO: Use query bus
            // TODO: Ignore collision with same Id
            const collisionResult = await this.businessCollisionCheck(
                onlineBusiness.name,
                onlineBusiness.website,
            );
            if (collisionResult.isCollision) {
                return {
                    status: SaveResultStatus.BUSINESS_ALREADY_EXISTS,
                    isNameCollision: collisionResult.isNameCollision,
                    isWebsiteCollision: collisionResult.isWebsiteCollision,
                };
            }
            await this.collection.replaceOne(
                { id: onlineBusiness.id },
                onlineBusiness.toPrimitives(),
                { upsert: true },
            );
            return {
                status: SaveResultStatus.OK,
            };
        } catch (error) {
            this.logger.error(error);
            return {
                status: SaveResultStatus.GENERIC_ERROR,
            };
        }
    }

    private async businessCollisionCheck(name: string, website: string) {
        const isNameCollision = !!(await this.collection.findOne({ name }));
        const isWebsiteCollision = !!(await this.collection.findOne({
            website,
        }));

        return {
            isCollision: isNameCollision || isWebsiteCollision,
            isNameCollision,
            isWebsiteCollision,
        };
    }
}
