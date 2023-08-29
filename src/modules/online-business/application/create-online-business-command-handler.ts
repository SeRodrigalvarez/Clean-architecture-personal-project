import { CreateOnlineBusinessCommand, OnlineBusinessCreator } from '.';
import { OnlineBusinessName, OnlineBusinessWebsite } from '../domain';
import {
    BusinessEmail,
    Id,
    COMMAND_BUS_PORT,
    CommandBus,
    CommandHandler,
} from 'src/modules/shared/domain';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CreateOnlineBusinessCommandHandler
    implements CommandHandler<CreateOnlineBusinessCommand>
{
    constructor(
        private onlineBusinessCreator: OnlineBusinessCreator,
        @Inject(COMMAND_BUS_PORT) private commandBus: CommandBus,
    ) {
        this.commandBus.addHandler(
            CreateOnlineBusinessCommand.COMMAND_NAME,
            this,
        );
    }
    async execute(command: CreateOnlineBusinessCommand) {
        await this.onlineBusinessCreator.execute(
            Id.createFrom(command.id),
            new OnlineBusinessName(command.name),
            new OnlineBusinessWebsite(command.website),
            new BusinessEmail(command.email),
        );
    }
}
