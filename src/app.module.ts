import { Module } from '@nestjs/common';
import { CreateOnlineBusinessController, GetOnlineBusinessByNameController } from './entrypoints/online-business/controller';
import { OnlineBusinessCreator, OnlineBusinessReader } from './modules/online-business/application';
import { ONLINE_BUSINESS_PORT } from './modules/online-business/domain';
import { InMemoryOnlineBusinessRepository } from './modules/online-business/infraestructure';

@Module({
    imports: [],
    controllers: [
      CreateOnlineBusinessController, 
      GetOnlineBusinessByNameController
    ],
    providers: [
        OnlineBusinessCreator,
        OnlineBusinessReader,
        {
            provide: ONLINE_BUSINESS_PORT,
            useClass: InMemoryOnlineBusinessRepository,
        },
    ],
})
export class AppModule {}
