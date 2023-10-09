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
    PhysicalBusiness,
    PhysicalBusinessAddress,
    PhysicalBusinessName,
    PhysicalBusinessPhone,
    PhysicalBusinessRepository,
    SaveResult,
    SaveResultStatus,
    UpdateResult,
    UpdateResultStatus,
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
    reviewsAmount: number;
}

@Injectable()
export class MongoPhysicalBusinessAdapter
    implements PhysicalBusinessRepository
{
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
            console.log(error); //TODO: use logger
            return {
                status: SaveResultStatus.GENERIC_ERROR,
            };
        }
    }

    async getByNameOrAddress(
        value: string,
        pageNumber: PageNumber,
        pageSize: PageSize,
    ): Promise<GetResult> {
        try {
            const cursor = await this.collection
                .find({
                    $or: [
                        { name: new RegExp(value, 'i') },
                        { 'address.street': new RegExp(value, 'i') },
                        { 'address.city': new RegExp(value, 'i') },
                        { 'address.postalCode': new RegExp(value, 'i') },
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
                physicalBusinesses: result,
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
                physicalBusiness: this.documentToDomain(result),
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
                physicalBusinesses: result,
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

    private async businessCollisionCheck(name: string, phone: string) {
        const isNameCollision = !!(await this.collection.findOne({ name }));
        const isPhoneCollision = !!(await this.collection.findOne({ phone }));

        return {
            isCollision: isNameCollision || isPhoneCollision,
            isNameCollision,
            isPhoneCollision,
        };
    }

    private documentToDomain(
        document: PhysicalBusinessDocument,
    ): PhysicalBusiness {
        return PhysicalBusiness.createFrom(
            Id.createFrom(document.id),
            new PhysicalBusinessName(document.name),
            new PhysicalBusinessAddress(
                document.address.street,
                document.address.city,
                document.address.postalCode,
                document.address.country,
            ),
            new PhysicalBusinessPhone(document.phone),
            new BusinessEmail(document.email),
            BusinessReviewsAmount.createFrom(document.reviewsAmount),
        );
    }
}
