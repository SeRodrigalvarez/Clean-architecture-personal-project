import { CommandResponse } from 'src/modules/shared/domain';
import { CreatePhysicalBusinessCommand } from '.';
import { SaveResultStatus } from '../domain';

export class CreatePhysicalBusinessCommandResponse extends CommandResponse {
    constructor(
        readonly status: SaveResultStatus,
        readonly isNameCollision?: boolean,
        readonly isPhoneCollision?: boolean,
    ) {
        super({ commandName: CreatePhysicalBusinessCommand.name });
    }
}
