import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Collection } from 'mongodb';
import {
    PageNumber,
    PageSize,
    Id,
    BusinessEmail,
    BusinessReviewsAmount,
    BusinessAverageRating,
} from 'src/modules/shared/domain';
import { MongoDatabaseConnection } from 'src/modules/shared/infrastructure/mongo-database-connection';
import {
    OnlineBusinessViewRepository,
    OnlineBusinessName,
    OnlineBusinessWebsite,
    GetSingleViewResult,
    GetViewResult,
    OnlineBusinessView,
    SaveViewResult,
    SaveViewResultStatus,
    GetViewResultStatus,
} from '../domain';

interface OnlineBusinessViewDocument {
    id: string;
    name: string;
    website: string;
    email: string;
    reviewsAmount: number;
    averageRating: number;
}

@Injectable()
export class MongoOnlineBusinessViewAdapter
    implements OnlineBusinessViewRepository
{
    private readonly logger = new Logger(MongoOnlineBusinessViewAdapter.name);

    private collection: Collection<OnlineBusinessViewDocument>;

    constructor(
        connection: MongoDatabaseConnection,
        private config: ConfigService,
    ) {
        this.collection =
            connection.database.collection<OnlineBusinessViewDocument>(
                this.config.get('MONGODB_ONLINE_BUSINESS_VIEW_COLLECTION'),
            );
    }

    async save(
        onlineBusinessView: OnlineBusinessView,
    ): Promise<SaveViewResult> {
        try {
            // TODO: Use query bus
            // TODO: Ignore collision with same Id
            const collisionResult = await this.businessCollisionCheck(
                onlineBusinessView.name,
                onlineBusinessView.website,
            );
            if (collisionResult.isCollision) {
                return {
                    status: SaveViewResultStatus.BUSINESS_ALREADY_EXISTS,
                    isNameCollision: collisionResult.isNameCollision,
                    isWebsiteCollision: collisionResult.isWebsiteCollision,
                };
            }

            await this.collection.replaceOne(
                { id: onlineBusinessView.id },
                onlineBusinessView.toPrimitives(),
                { upsert: true },
            );
            return {
                status: SaveViewResultStatus.OK,
            };
        } catch (error) {
            this.logger.error(error.stack);
            return {
                status: SaveViewResultStatus.GENERIC_ERROR,
            };
        }
    }

    async getByNameOrWebsite(
        value: string,
        pageNumber: PageNumber,
        pageSize: PageSize,
    ): Promise<GetViewResult> {
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
                    status: GetViewResultStatus.NOT_FOUND,
                };
            }
            return {
                status: GetViewResultStatus.OK,
                onlineBusinessViews: result,
            };
        } catch (error) {
            this.logger.error(error.stack);
            return {
                status: GetViewResultStatus.GENERIC_ERROR,
            };
        }
    }

    async getById(id: Id): Promise<GetSingleViewResult> {
        try {
            const result = await this.collection.findOne({ id: id.value });
            if (!result) {
                return {
                    status: GetViewResultStatus.NOT_FOUND,
                };
            }
            return {
                status: GetViewResultStatus.OK,
                onlineBusinessView: this.documentToDomain(result),
            };
        } catch (error) {
            this.logger.error(error.stack);
            return {
                status: GetViewResultStatus.GENERIC_ERROR,
            };
        }
    }

    async getAll(
        pageNumber: PageNumber,
        pageSize: PageSize,
    ): Promise<GetViewResult> {
        try {
            const cursor = await this.collection
                .find()
                .skip(pageNumber.value * pageSize.value)
                .limit(pageSize.value);
            const array = await cursor.toArray();
            const result = await array.map(this.documentToDomain);
            if (result.length === 0) {
                return {
                    status: GetViewResultStatus.NOT_FOUND,
                };
            }
            return {
                status: GetViewResultStatus.OK,
                onlineBusinessViews: result,
            };
        } catch (error) {
            this.logger.error(error.stack);
            return {
                status: GetViewResultStatus.GENERIC_ERROR,
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

    private documentToDomain(
        document: OnlineBusinessViewDocument,
    ): OnlineBusinessView {
        return OnlineBusinessView.createFrom(
            Id.createFrom(document.id),
            new OnlineBusinessName(document.name),
            new OnlineBusinessWebsite(document.website),
            new BusinessEmail(document.email),
            BusinessReviewsAmount.createFrom(document.reviewsAmount),
            BusinessAverageRating.createFrom(document.averageRating),
        );
    }
}
