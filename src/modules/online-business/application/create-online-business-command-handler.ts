import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
    CreateOnlineBusinessCommand,
    OnlineBusinessCreator,
    OnlineBusinessCreatorResult,
} from '.';
import { OnlineBusinessName, OnlineBusinessWebsite } from '../domain';
import { BusinessEmail } from 'src/modules/shared/domain';

@CommandHandler(CreateOnlineBusinessCommand)
export class CreateOnlineBusinessCommandHandler
    implements ICommandHandler<CreateOnlineBusinessCommand>
{
    constructor(private onlineBusinessCreator: OnlineBusinessCreator) {}

    async execute(
        command: CreateOnlineBusinessCommand,
    ): Promise<OnlineBusinessCreatorResult> {
        return await this.onlineBusinessCreator.execute(
            new OnlineBusinessName(command.name),
            new OnlineBusinessWebsite(command.website),
            new BusinessEmail(command.email),
        );
    }
}
