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
    OnlineBusinessCreatedEventSubscriber,
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
    CreateBusinessReviewController,
];
const GetControllers = [
    GetOnlineBusinessesController,
    GetOnlineBusinessByIdController,
    GetPhysicalBusinessesController,
    GetPhysicalBusinessByIdController,
    GetBusinessReviewController,
];

const CommandHandlers = [
    CreateOnlineBusinessCommandHandler,
    CreatePhysicalBusinessCommandHanlder,
];

const EventSubscribers = [OnlineBusinessCreatedEventSubscriber];

const QueryHandlers = [
    GetOnlineBusinessesQueryHandler,
    GetOnlineBusinessByIdQueryHandler,
    GetPhysicalBusinessesQueryHandler,
    GetPhysicalBusinessByIdQueryHanlder,
];

const CreatorUseCases = [
    OnlineBusinessCreator,
    OnlineBusinessViewCreator,
    PhysicalBusinessCreator,
    BusinessReviewCreator,
];

const ReaderUseCases = [
    OnlineBusinessReader,
    PhysicalBusinessReader,
    BusinessReviewReader,
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
        provide: REVIEW_REPOSITORY_PORT,
        useClass: MongoReviewAdapter,
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
        ...ReaderUseCases,
        ...Repositories,
        ...Buses,
    ],
})
export class AppModule {}
