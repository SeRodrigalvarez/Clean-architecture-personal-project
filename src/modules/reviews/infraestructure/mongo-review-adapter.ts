import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Collection } from 'mongodb';
import { Id, PageNumber, PageSize } from 'src/modules/shared/domain';
import { MongoDatabaseConnection } from 'src/modules/shared/infraestructure/mongo-database-connection';
import {
    CreateResult,
    CreateResultStatus,
    GetResult,
    GetResultStatus,
    GetSingleResult,
    Review,
    ReviewRating,
    ReviewRepository,
    ReviewText,
    Username,
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
    private collection: Collection<ReviewDocument>;

    constructor(
        connection: MongoDatabaseConnection,
        private config: ConfigService,
    ) {
        this.collection = connection.database.collection<ReviewDocument>(
            this.config.get('MONGODB_REVIEW_COLLECTION'),
        );
    }

    async create(review: Review): Promise<CreateResult> {
        try {
            if (await this.isDuplicatedReview(review)) {
                return {
                    status: CreateResultStatus.DUPLICATED_REVIEW,
                };
            }
            await this.collection.insertOne(this.domainToDocument(review));
            return {
                status: CreateResultStatus.OK,
            };
        } catch (error) {
            console.log(error); //TODO: use logger
            return {
                status: CreateResultStatus.GENERIC_ERROR,
            };
        }
    }

    async getByBusinessId(
        id: Id,
        pageNumber: PageNumber,
        pageSize: PageSize,
    ): Promise<GetResult> {
        try {
            const cursor = await this.collection
                .find({ businessId: id.value })
                .skip(pageNumber.value * pageSize.value)
                .limit(pageNumber.value);
            const array = await cursor.toArray();
            const result = await array.map(this.documentToDomain);
            if (result.length === 0) {
                return {
                    status: GetResultStatus.NOT_FOUND,
                };
            }
            return {
                status: GetResultStatus.OK,
                reviews: result,
            };
        } catch (error) {
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
                review: this.documentToDomain(result),
            };
        } catch (error) {
            console.log(error); //TODO: use logger
            return {
                status: GetResultStatus.GENERIC_ERROR,
            };
        }
    }

    private domainToDocument(review: Review): ReviewDocument {
        return {
            id: review.id,
            businessId: review.businessId,
            text: review.text,
            rating: review.rating,
            username: review.username,
        };
    }

    private documentToDomain(document: ReviewDocument): Review {
        return Review.createFrom(
            Id.createFrom(document.id),
            Id.createFrom(document.businessId),
            new ReviewText(document.text),
            new ReviewRating(document.rating),
            new Username(document.username),
        );
    }

    private async isDuplicatedReview(review: Review) {
        return !!(await this.collection.findOne({ username: review.username }));
    }
}
