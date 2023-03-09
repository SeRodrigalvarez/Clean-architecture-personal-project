import { Module } from '@nestjs/common';
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
    GetOnlineBusinessReviewController,
    GetPhysicalBusinessReviewController,
} from './entrypoints/reviews/controller';
import {
    OnlineBusinessCreator,
    OnlineBusinessReader,
} from './modules/online-business/application';
import { ONLINE_BUSINESS_PORT } from './modules/online-business/domain';
import { InMemoryOnlineBusinessAdapter } from './modules/online-business/infraestructure';
import {
    PhysicalBusinessCreator,
    PhysicalBusinessReader,
} from './modules/physical-business/application';
import { PHYSICAL_BUSINESS_PORT } from './modules/physical-business/domain';
import { InMemoryPhysicalBusinessAdapter } from './modules/physical-business/infraestructure';
import {
    OnlineBusinessReviewCreator,
    OnlineBusinessReviewReader,
    PhysicalBusinessReviewCreator,
    PhysicalBusinessReviewReader,
} from './modules/reviews/application';
import { REVIEW_REPOSITORY_PORT } from './modules/reviews/domain';
import { InMemoryReviewAdapter } from './modules/reviews/infraestructure';

@Module({
    imports: [],
    controllers: [
        CreateOnlineBusinessController,
        CreateOnlineBusinessReviewController,
        CreatePhysicalBusinessController,
        CreatePhysicalBusinessReviewController,
        GetOnlineBusinessController,
        GetOnlineBusinessReviewController,
        GetPhysicalBusinessController,
        GetPhysicalBusinessReviewController,
    ],
    providers: [
        OnlineBusinessCreator,
        PhysicalBusinessCreator,
        OnlineBusinessReviewCreator,
        PhysicalBusinessReviewCreator,
        OnlineBusinessReader,
        PhysicalBusinessReader,
        OnlineBusinessReviewReader,
        PhysicalBusinessReviewReader,
        {
            provide: ONLINE_BUSINESS_PORT,
            useClass: InMemoryOnlineBusinessAdapter,
        },
        {
            provide: PHYSICAL_BUSINESS_PORT,
            useClass: InMemoryPhysicalBusinessAdapter,
        },
        {
            provide: REVIEW_REPOSITORY_PORT,
            useClass: InMemoryReviewAdapter,
        },
    ],
})
export class AppModule {}
