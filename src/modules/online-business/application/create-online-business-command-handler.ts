import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
    CreateOnlineBusinessCommand,
    OnlineBusinessCreator,
    OnlineBusinessCreatorResultStatus,
} from '.';
import { OnlineBusinessName, OnlineBusinessWebsite } from '../domain';
import { BusinessEmail } from 'src/modules/shared/domain';

export interface CreateOnlineBusinessCommandResult {
    status: CreateOnlineBusinessCommandResultStatus;
    id?: string;
}

export enum CreateOnlineBusinessCommandResultStatus {
    OK,
    BUSINESS_NAME_ALREADY_EXISTS,
    GENERIC_ERROR,
}

@CommandHandler(CreateOnlineBusinessCommand)
export class CreateOnlineBusinessCommandHandler
    implements ICommandHandler<CreateOnlineBusinessCommand>
{
    constructor(private onlineBusinessCreator: OnlineBusinessCreator) {}

    async execute(
        command: CreateOnlineBusinessCommand,
    ): Promise<CreateOnlineBusinessCommandResult> {
        const result = await this.onlineBusinessCreator.execute(
            new OnlineBusinessName(command.name),
            new OnlineBusinessWebsite(command.website),
            new BusinessEmail(command.email),
        );

        if (
            result.status ===
            OnlineBusinessCreatorResultStatus.BUSINESS_NAME_ALREADY_EXISTS
        ) {
            return {
                status: CreateOnlineBusinessCommandResultStatus.BUSINESS_NAME_ALREADY_EXISTS,
            };
        }

        if (result.status === OnlineBusinessCreatorResultStatus.GENERIC_ERROR) {
            return {
                status: CreateOnlineBusinessCommandResultStatus.GENERIC_ERROR,
            };
        }

        return {
            status: CreateOnlineBusinessCommandResultStatus.OK,
            id: result.id,
        };
    }
}
