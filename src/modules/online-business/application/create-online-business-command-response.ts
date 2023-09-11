import { CommandResponse } from 'src/modules/shared/domain';
import { CreateOnlineBusinessCommand } from '.';
import { SaveResultStatus } from '../domain';

export class CreateOnlineBusinessCommandResponse extends CommandResponse {
    constructor(
        readonly status: SaveResultStatus,
        readonly isNameCollision?: boolean,
        readonly isWebsiteCollision?: boolean,
    ) {
        super({ commandName: CreateOnlineBusinessCommand.name });
    }
}
