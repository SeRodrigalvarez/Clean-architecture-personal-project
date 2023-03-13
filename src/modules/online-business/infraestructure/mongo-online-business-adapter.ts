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
import { MongoDatabaseConnection } from 'src/modules/shared/infraestructure/mongo-database-connection';
import {
    CreateResult,
    CreateResultStatus,
    GetResult,
    GetResultStatus,
    GetSingleResult,
    OnlineBusiness,
    OnlineBusinessName,
    OnlineBusinessRepository,
    OnlineBusinessWebsite,
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

    async create(onlineBusiness: OnlineBusiness): Promise<CreateResult> {
        try {
            if (await this.doesNameAlreadyExists(onlineBusiness.name)) {
                return {
                    status: CreateResultStatus.BUSINESS_NAME_ALREADY_EXISTS,
                };
            }
            await this.collection.insertOne(
                this.domainToDocument(onlineBusiness),
            );
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

    private async doesNameAlreadyExists(name: string) {
        return !!(await this.collection.findOne({ name }));
    }

    private domainToDocument(business: OnlineBusiness): OnlineBusinessDocument {
        return {
            id: business.id,
            name: business.name,
            website: business.website,
            email: business.email,
            reviewsAmount: business.reviewsAmount,
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
