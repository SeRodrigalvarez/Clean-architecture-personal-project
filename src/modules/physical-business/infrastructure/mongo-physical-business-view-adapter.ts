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
    SaveViewResultStatus,
    PhysicalBusinessAddress,
    PhysicalBusinessName,
    PhysicalBusinessPhone,
    PhysicalBusinessViewRepository,
    SaveViewResult,
    PhysicalBusinessView,
    GetViewResultStatus,
    GetViewResult,
    GetSingleViewResult,
} from '../domain';

interface PhysicalBusinessViewDocument {
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
    averageRating: number;
}

@Injectable()
export class MongoPhysicalBusinessViewAdapter
    implements PhysicalBusinessViewRepository
{
    private readonly logger = new Logger(MongoPhysicalBusinessViewAdapter.name);

    private collection: Collection<PhysicalBusinessViewDocument>;

    constructor(
        connection: MongoDatabaseConnection,
        private config: ConfigService,
    ) {
        this.collection =
            connection.database.collection<PhysicalBusinessViewDocument>(
                this.config.get('MONGODB_PHYSICAL_BUSINESS_VIEW_COLLECTION'),
            );
    }

    async save(
        physicalBusinessView: PhysicalBusinessView,
    ): Promise<SaveViewResult> {
        try {
            await this.collection.replaceOne(
                { id: physicalBusinessView.id },
                physicalBusinessView.toPrimitives(),
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

    async getByNameOrAddress(
        value: string,
        pageNumber: PageNumber,
        pageSize: PageSize,
    ): Promise<GetViewResult> {
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
                    status: GetViewResultStatus.NOT_FOUND,
                };
            }
            return {
                status: GetViewResultStatus.OK,
                physicalBusinessViews: result,
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
                physicalBusinessView: this.documentToDomain(result),
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
                physicalBusinessViews: result,
            };
        } catch (error) {
            this.logger.error(error.stack);
            return {
                status: GetViewResultStatus.GENERIC_ERROR,
            };
        }
    }

    private documentToDomain(
        document: PhysicalBusinessViewDocument,
    ): PhysicalBusinessView {
        return PhysicalBusinessView.createFrom(
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
            BusinessAverageRating.createFrom(document.averageRating),
        );
    }
}
