import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import {
    CreateOnlineBusinessController,
    GetOnlineBusinessesController,
    GetOnlineBusinessByIdController,
} from './entrypoints/online-business/controller';
import {
    CreatePhysicalBusinessController,
    GetPhysicalBusinessByIdController,
    GetPhysicalBusinessesController,
} from './entrypoints/physical-business/controller';
import {
    CreateBusinessReviewController,
    GetBusinessReviewController,
} from './entrypoints/reviews/controller';
import {
    CreateOnlineBusinessCommandHandler,
    GetOnlineBusinessByIdQueryHandler,
    GetOnlineBusinessesQueryHandler,
    OnlineBusinessCreator,
    OnlineBusinessReader,
    OnlineBusinessViewCreator,
} from './modules/online-business/application';
import {
    ONLINE_BUSINESS_PORT,
    ONLINE_BUSINESS_VIEW_PORT,
} from './modules/online-business/domain';
import {
    MongoOnlineBusinessAdapter,
    MongoOnlineBusinessViewAdapter,
} from './modules/online-business/infrastructure';
import {
    CreatePhysicalBusinessCommandHanlder,
    GetPhysicalBusinessByIdQueryHanlder,
    GetPhysicalBusinessesQueryHandler,
    PhysicalBusinessCreator,
    PhysicalBusinessReader,
} from './modules/physical-business/application';
import { PHYSICAL_BUSINESS_PORT } from './modules/physical-business/domain';
import { MongoPhysicalBusinessAdapter } from './modules/physical-business/infrastructure';
import {
    BusinessReviewCreator,
    BusinessReviewReader,
} from './modules/reviews/application';
import { REVIEW_REPOSITORY_PORT } from './modules/reviews/domain';
import { MongoReviewAdapter } from './modules/reviews/infrastructure';
import {
    InMemoryCommandBus,
    MongoDatabaseConnection,
} from './modules/shared/infrastructure';
import { COMMAND_BUS_PORT } from './modules/shared/domain';

export const CreateControllers = [
    CreateOnlineBusinessController,
    CreatePhysicalBusinessController,
    CreateBusinessReviewController,
];
export const GetControllers = [
    GetOnlineBusinessesController,
    GetOnlineBusinessByIdController,
    GetPhysicalBusinessesController,
    GetPhysicalBusinessByIdController,
    GetBusinessReviewController,
];

export const CommandHandlers = [
    CreateOnlineBusinessCommandHandler,
    CreatePhysicalBusinessCommandHanlder,
];

export const QueryHandlers = [
    GetOnlineBusinessesQueryHandler,
    GetOnlineBusinessByIdQueryHandler,
    GetPhysicalBusinessesQueryHandler,
    GetPhysicalBusinessByIdQueryHanlder,
];

export const CreatorUseCases = [
    OnlineBusinessCreator,
    OnlineBusinessViewCreator,
    PhysicalBusinessCreator,
    BusinessReviewCreator,
];
export const ReaderUseCases = [
    OnlineBusinessReader,
    PhysicalBusinessReader,
    BusinessReviewReader,
];

@Module({
    imports: [ConfigModule.forRoot(), CqrsModule],
    controllers: [...CreateControllers, ...GetControllers],
    providers: [
        ...CommandHandlers,
        ...QueryHandlers,
        ...CreatorUseCases,
        ...ReaderUseCases,
        MongoDatabaseConnection,
        {
            provide: ONLINE_BUSINESS_PORT,
            useClass: MongoOnlineBusinessAdapter,
        },
        {
            provide: ONLINE_BUSINESS_VIEW_PORT,
            useClass: MongoOnlineBusinessViewAdapter,
        },
        {
            provide: PHYSICAL_BUSINESS_PORT,
            useClass: MongoPhysicalBusinessAdapter,
        },
        {
            provide: REVIEW_REPOSITORY_PORT,
            useClass: MongoReviewAdapter,
        },
        {
            provide: COMMAND_BUS_PORT,
            useClass: InMemoryCommandBus,
        },
    ],
})
export class AppModule {}
