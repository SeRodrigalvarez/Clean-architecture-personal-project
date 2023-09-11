import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Collection } from 'mongodb';
import {
    Id,
    PageNumber,
    PageSize,
    ReviewRating,
} from 'src/modules/shared/domain';
import { MongoDatabaseConnection } from 'src/modules/shared/infrastructure';
import {
    GetSingleViewResult,
    GetViewResult,
    GetViewResultStatus,
    ReviewText,
    ReviewView,
    ReviewViewRepository,
    SaveViewResult,
    SaveViewResultStatus,
    Username,
} from '../domain';

interface ReviewViewDocument {
    id: string;
    businessId: string;
    text: string;
    rating: number;
    username: string;
}

@Injectable()
export class MongoReviewViewAdapter implements ReviewViewRepository {
    private readonly logger = new Logger(MongoReviewViewAdapter.name);

    private collection: Collection<ReviewViewDocument>;

    constructor(
        connection: MongoDatabaseConnection,
        private config: ConfigService,
    ) {
        this.collection = connection.database.collection<ReviewViewDocument>(
            this.config.get('MONGODB_REVIEW_VIEW_COLLECTION'),
        );
    }

    async save(reviewView: ReviewView): Promise<SaveViewResult> {
        try {
            await this.collection.replaceOne(
                { id: reviewView.id },
                reviewView.toPrimitives(),
                { upsert: true },
            );
            return {
                status: SaveViewResultStatus.OK,
            };
        } catch (error) {
            this.logger.error(error);
            return {
                status: SaveViewResultStatus.GENERIC_ERROR,
            };
        }
    }

    async getByBusinessId(
        id: Id,
        pageNumber: PageNumber,
        pageSize: PageSize,
    ): Promise<GetViewResult> {
        try {
            const cursor = await this.collection
                .find({ businessId: id.value })
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
                reviewViews: result,
            };
        } catch (error) {
            this.logger.error(error);
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
                reviewView: this.documentToDomain(result),
            };
        } catch (error) {
            this.logger.error(error);
            return {
                status: GetViewResultStatus.GENERIC_ERROR,
            };
        }
    }

    async getAverageRatingByBusinessId(id: Id): Promise<number> {
        const cursor = this.collection.aggregate([
            {
                $match: { businessId: id.value },
            },
            {
                $group: {
                    _id: 'averageRating',
                    averageRating: { $avg: '$rating' },
                },
            },
            {
                $project: {
                    averageRating: {
                        $round: ['$averageRating', 1],
                    },
                },
            },
        ]);
        if (await cursor.hasNext()) {
            const result = await cursor.next();
            return result.averageRating;
        }
        return 0.0;
    }

    private documentToDomain(document: ReviewViewDocument): ReviewView {
        return ReviewView.create(
            Id.createFrom(document.id),
            Id.createFrom(document.businessId),
            new ReviewText(document.text),
            new ReviewRating(document.rating),
            new Username(document.username),
        );
    }
}
