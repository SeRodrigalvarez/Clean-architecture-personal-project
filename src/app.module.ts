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
    CreateReviewController,
    GetReviewByIdController,
    GetReviewsByBusinessIdController,
} from './entrypoints/reviews/controller';
import {
    CreateOnlineBusinessCommandHandler,
    GetOnlineBusinessByIdQueryHandler,
    GetOnlineBusinessesQueryHandler,
    CreateOnlineBusinessViewOnOnlineBusinessCreated,
    OnlineBusinessCreator,
    OnlineBusinessReader,
    OnlineBusinessViewCreator,
    OnlineBusinessViewUpdater,
    UpdateOnlineBusinessRatingOnReviewCreated,
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
    CreatePhysicalBusinessViewOnPhysicalBusinessCreated,
    PhysicalBusinessCreator,
    PhysicalBusinessReader,
    PhysicalBusinessViewCreator,
    PhysicalBusinessViewUpdater,
    UpdatePhysicalBusinessRatingOnReviewCreated,
} from './modules/physical-business/application';
import {
    PHYSICAL_BUSINESS_PORT,
    PHYSICAL_BUSINESS_VIEW_PORT,
} from './modules/physical-business/domain';
import {
    MongoPhysicalBusinessAdapter,
    MongoPhysicalBusinessViewAdapter,
} from './modules/physical-business/infrastructure';
import {
    CreateReviewCommandHandler,
    CreateReviewViewOnReviewCreated,
    GetAverageRatingByBusinessIdQueryHandler,
    GetReviewByIdQueryHandler,
    GetReviewsByBusinessIdQueryHandler,
    ReviewCreator,
    ReviewReader,
    ReviewViewCreator,
} from './modules/reviews/application';
import {
    REVIEW_REPOSITORY_PORT,
    REVIEW_REPOSITORY_VIEW_PORT,
} from './modules/reviews/domain';
import {
    MongoReviewAdapter,
    MongoReviewViewAdapter,
} from './modules/reviews/infrastructure';
import {
    InMemoryCommandBus,
    InMemoryQueryBus,
    InMemoryEventBus,
    MongoDatabaseConnection,
} from './modules/shared/infrastructure';
import {
    COMMAND_BUS_PORT,
    EVENT_BUS_PORT,
    QUERY_BUS_PORT,
} from './modules/shared/domain';

const CreateControllers = [
    CreateOnlineBusinessController,
    CreatePhysicalBusinessController,
    CreateReviewController,
];

const GetControllers = [
    GetOnlineBusinessesController,
    GetOnlineBusinessByIdController,
    GetPhysicalBusinessesController,
    GetPhysicalBusinessByIdController,
    GetReviewByIdController,
    GetReviewsByBusinessIdController,
];

const CommandHandlers = [
    CreateOnlineBusinessCommandHandler,
    CreatePhysicalBusinessCommandHanlder,
    CreateReviewCommandHandler,
];

const EventSubscribers = [
    CreateOnlineBusinessViewOnOnlineBusinessCreated,
    CreatePhysicalBusinessViewOnPhysicalBusinessCreated,
    CreateReviewViewOnReviewCreated,
    UpdateOnlineBusinessRatingOnReviewCreated,
    UpdatePhysicalBusinessRatingOnReviewCreated,
];

const QueryHandlers = [
    GetOnlineBusinessesQueryHandler,
    GetOnlineBusinessByIdQueryHandler,
    GetPhysicalBusinessesQueryHandler,
    GetPhysicalBusinessByIdQueryHanlder,
    GetReviewByIdQueryHandler,
    GetReviewsByBusinessIdQueryHandler,
    GetAverageRatingByBusinessIdQueryHandler,
];

const CreatorUseCases = [
    OnlineBusinessCreator,
    OnlineBusinessViewCreator,
    PhysicalBusinessCreator,
    PhysicalBusinessViewCreator,
    ReviewCreator,
    ReviewViewCreator,
];

const UpdaterUseCases = [
    OnlineBusinessViewUpdater,
    PhysicalBusinessViewUpdater,
];

const ReaderUseCases = [
    OnlineBusinessReader,
    PhysicalBusinessReader,
    ReviewReader,
];

const Buses = [
    {
        provide: COMMAND_BUS_PORT,
        useClass: InMemoryCommandBus,
    },
    {
        provide: QUERY_BUS_PORT,
        useClass: InMemoryQueryBus,
    },
    {
        provide: EVENT_BUS_PORT,
        useClass: InMemoryEventBus,
    },
];

const Repositories = [
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
        provide: PHYSICAL_BUSINESS_VIEW_PORT,
        useClass: MongoPhysicalBusinessViewAdapter,
    },
    {
        provide: REVIEW_REPOSITORY_PORT,
        useClass: MongoReviewAdapter,
    },
    {
        provide: REVIEW_REPOSITORY_VIEW_PORT,
        useClass: MongoReviewViewAdapter,
    },
];

@Module({
    imports: [ConfigModule.forRoot(), CqrsModule],
    controllers: [...CreateControllers, ...GetControllers],
    providers: [
        ...CommandHandlers,
        ...EventSubscribers,
        ...QueryHandlers,
        ...CreatorUseCases,
        ...UpdaterUseCases,
        ...ReaderUseCases,
        ...Repositories,
        ...Buses,
    ],
})
export class AppModule {}
