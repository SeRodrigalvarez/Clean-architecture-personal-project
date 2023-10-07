import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Collection } from 'mongodb';
import {
    PageNumber,
    PageSize,
    Id,
    BusinessEmail,
    BusinessReviewsAmount,
} from 'src/modules/shared/domain';
import { MongoDatabaseConnection } from 'src/modules/shared/infrastructure/mongo-database-connection';
import {
    GetResult,
    GetResultStatus,
    GetSingleResult,
    OnlineBusiness,
    OnlineBusinessName,
    OnlineBusinessRepository,
    OnlineBusinessWebsite,
    SaveResult,
    SaveResultStatus,
    UpdateResult,
    UpdateResultStatus,
} from '../domain';

interface OnlineBusinessDocument {
    id: string;
    name: string;
    website: string;
    email: string;
    reviewsAmount: number;
}

@Injectable()
export class MongoOnlineBusinessAdapter implements OnlineBusinessRepository {
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
            // TODO: Use reservation pattern or unique index to avoid race condition bugs
            const collisionResult = await this.businessCollisionCheck(
                onlineBusiness.id,
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
            console.log(error); //TODO: use logger
            return {
                status: SaveResultStatus.GENERIC_ERROR,
            };
        }
    }

    async getByNameOrWebsite(
        value: string,
        pageNumber: PageNumber,
        pageSize: PageSize,
    ): Promise<GetResult> {
        try {
            const cursor = await this.collection
                .find({
                    $or: [
                        { name: new RegExp(value, 'i') },
                        { website: new RegExp(value, 'i') },
                    ],
                })
                .skip(pageNumber.value * pageSize.value)
                .limit(pageSize.value);
            const array = await cursor.toArray();
            const result = await array.map(this.documentToDomain);
            if (result.length === 0) {
                return {
                    status: GetResultStatus.NOT_FOUND,
                };
            }
            return {
                status: GetResultStatus.OK,
                onlineBusinesses: result,
            };
        } catch (error) {
            console.log(error); //TODO: use logger
            return {
                status: GetResultStatus.GENERIC_ERROR,
            };
        }
    }

    async getById(id: Id): Promise<GetSingleResult> {
        try {
            const result = await this.collection.findOne({ id: id.value });
            if (!result) {
                return {
                    status: GetResultStatus.NOT_FOUND,
                };
            }
            return {
                status: GetResultStatus.OK,
                onlineBusiness: this.documentToDomain(result),
            };
        } catch (error) {
            console.log(error); //TODO: use logger
            return {
                status: GetResultStatus.GENERIC_ERROR,
            };
        }
    }

    async getAll(
        pageNumber: PageNumber,
        pageSize: PageSize,
    ): Promise<GetResult> {
        try {
            const cursor = await this.collection
                .find()
                .skip(pageNumber.value * pageSize.value)
                .limit(pageSize.value);
            const array = await cursor.toArray();
            const result = await array.map(this.documentToDomain);
            if (result.length === 0) {
                return {
                    status: GetResultStatus.NOT_FOUND,
                };
            }
            return {
                status: GetResultStatus.OK,
                onlineBusinesses: result,
            };
        } catch (error) {
            console.log(error); //TODO: use logger
            return {
                status: GetResultStatus.GENERIC_ERROR,
            };
        }
    }

    async increaseReviewAmount(id: Id): Promise<UpdateResult> {
        try {
            const result = await this.collection.findOneAndUpdate(
                { id: id.value },
                { $inc: { reviewsAmount: 1 } },
            );
            if (result.lastErrorObject.updatedExisting) {
                return {
                    status: UpdateResultStatus.OK,
                };
            }
            return {
                status: UpdateResultStatus.NOT_FOUND,
            };
        } catch (error) {
            console.log(error); //TODO: use logger
            return {
                status: UpdateResultStatus.GENERIC_ERROR,
            };
        }
    }

    private async businessCollisionCheck(
        id: string,
        name: string,
        website: string,
    ) {
        const isNameCollision = !!(await this.collection.findOne({
            name,
            id: { $ne: id },
        }));
        const isWebsiteCollision = !!(await this.collection.findOne({
            website,
            id: { $ne: id },
        }));

        return {
            isCollision: isNameCollision || isWebsiteCollision,
            isNameCollision,
            isWebsiteCollision,
        };
    }

    private documentToDomain(document: OnlineBusinessDocument): OnlineBusiness {
        return OnlineBusiness.createFrom(
            Id.createFrom(document.id),
            new OnlineBusinessName(document.name),
            new OnlineBusinessWebsite(document.website),
            new BusinessEmail(document.email),
            BusinessReviewsAmount.createFrom(document.reviewsAmount),
        );
    }
}
