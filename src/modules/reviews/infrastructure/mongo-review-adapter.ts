import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Collection } from 'mongodb';
import { MongoDatabaseConnection } from 'src/modules/shared/infrastructure';
import {
    Review,
    ReviewRepository,
    SaveResult,
    SaveResultStatus,
} from '../domain';

interface ReviewDocument {
    id: string;
    businessId: string;
    text: string;
    rating: number;
    username: string;
}

@Injectable()
export class MongoReviewAdapter implements ReviewRepository {
    private readonly logger = new Logger(MongoReviewAdapter.name);

    private collection: Collection<ReviewDocument>;

    constructor(
        connection: MongoDatabaseConnection,
        private config: ConfigService,
    ) {
        this.collection = connection.database.collection<ReviewDocument>(
            this.config.get('MONGODB_REVIEW_COLLECTION'),
        );
    }

    async save(review: Review): Promise<SaveResult> {
        try {
            if (await this.isDuplicatedReview(review)) {
                return {
                    status: SaveResultStatus.DUPLICATED_REVIEW,
                };
            }
            await this.collection.replaceOne(
                { id: review.id },
                review.toPrimitives(),
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

    private async isDuplicatedReview(review: Review) {
        return !!(await this.collection.findOne({
            username: review.username,
            businessId: review.businessId,
        }));
    }
}
