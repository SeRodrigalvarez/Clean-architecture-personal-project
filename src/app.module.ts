import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
    CreateOnlineBusinessController,
    GetOnlineBusinessController,
} from './entrypoints/online-business/controller';
import {
    CreatePhysicalBusinessController,
    GetPhysicalBusinessController,
} from './entrypoints/physical-business/controller';
import {
    CreateOnlineBusinessReviewController,
    CreatePhysicalBusinessReviewController,
    GetBusinessReviewController,
} from './entrypoints/reviews/controller';
import {
    OnlineBusinessCreator,
    OnlineBusinessReader,
} from './modules/online-business/application';
import { ONLINE_BUSINESS_PORT } from './modules/online-business/domain';
import { MongoOnlineBusinessAdapter } from './modules/online-business/infraestructure';
import {
    PhysicalBusinessCreator,
    PhysicalBusinessReader,
} from './modules/physical-business/application';
import { PHYSICAL_BUSINESS_PORT } from './modules/physical-business/domain';
import { MongoPhysicalBusinessAdapter } from './modules/physical-business/infraestructure';
import {
    OnlineBusinessReviewCreator,
    PhysicalBusinessReviewCreator,
    BusinessReviewReader,
} from './modules/reviews/application';
import { REVIEW_REPOSITORY_PORT } from './modules/reviews/domain';
import { MongoReviewAdapter } from './modules/reviews/infraestructure';
import { MongoDatabaseConnection } from './modules/shared/infraestructure/mongo-database-connection';

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [
        CreateOnlineBusinessController,
        CreateOnlineBusinessReviewController,
        CreatePhysicalBusinessController,
        CreatePhysicalBusinessReviewController,
        GetOnlineBusinessController,
        GetPhysicalBusinessController,
        GetBusinessReviewController,
    ],
    providers: [
        OnlineBusinessCreator,
        PhysicalBusinessCreator,
        OnlineBusinessReviewCreator,
        PhysicalBusinessReviewCreator,
        OnlineBusinessReader,
        PhysicalBusinessReader,
        BusinessReviewReader,
        MongoDatabaseConnection,
        {
            provide: ONLINE_BUSINESS_PORT,
            useClass: MongoOnlineBusinessAdapter,
        },
        {
            provide: PHYSICAL_BUSINESS_PORT,
            useClass: MongoPhysicalBusinessAdapter,
        },
        {
            provide: REVIEW_REPOSITORY_PORT,
            useClass: MongoReviewAdapter,
        },
    ],
})
export class AppModule {}
