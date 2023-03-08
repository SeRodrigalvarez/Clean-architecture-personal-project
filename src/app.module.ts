import { Module } from '@nestjs/common';
import {
    CreateOnlineBusinessController,
    GetOnlineBusinessController,
} from './entrypoints/online-business/controller';
import {
    CreateReviewController,
    GetReviewController,
} from './entrypoints/reviews/controller';
import {
    OnlineBusinessCreator,
    OnlineBusinessReader,
} from './modules/online-business/application';
import { ONLINE_BUSINESS_PORT } from './modules/online-business/domain';
import { InMemoryOnlineBusinessAdapter } from './modules/online-business/infraestructure';
import { ReviewCreator, ReviewReader } from './modules/reviews/application';
import { REVIEW_REPOSITORY_PORT } from './modules/reviews/domain';
import { InMemoryReviewAdapter } from './modules/reviews/infraestructure';

@Module({
    imports: [],
    controllers: [
        CreateOnlineBusinessController,
        GetOnlineBusinessController,
        CreateReviewController,
        GetReviewController,
    ],
    providers: [
        OnlineBusinessCreator,
        OnlineBusinessReader,
        ReviewCreator,
        ReviewReader,
        {
            provide: ONLINE_BUSINESS_PORT,
            useClass: InMemoryOnlineBusinessAdapter,
        },
        {
            provide: REVIEW_REPOSITORY_PORT,
            useClass: InMemoryReviewAdapter,
        },
    ],
})
export class AppModule {}
