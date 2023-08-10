import {
    COMMAND_BUS_PORT,
    CommandBus,
    CommandHandler,
    CreateOnlineBusinessCommand,
} from 'src/modules/shared/domain/commands';
import { OnlineBusinessCreator } from '.';
import { OnlineBusinessName, OnlineBusinessWebsite } from '../domain';
import { BusinessEmail, Id } from 'src/modules/shared/domain';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CreateOnlineBusinessCommandHandler implements CommandHandler {
    constructor(
        private onlineBusinessCreator: OnlineBusinessCreator,
        @Inject(COMMAND_BUS_PORT) private commandBus: CommandBus,
    ) {
        this.commandBus.addHandler(CreateOnlineBusinessCommand, this);
    }
    async execute(command: CreateOnlineBusinessCommand) {
        this.onlineBusinessCreator.execute(
            Id.createFrom(command.id),
            new OnlineBusinessName(command.name),
            new OnlineBusinessWebsite(command.website),
            new BusinessEmail(command.email),
        );
    }
}
