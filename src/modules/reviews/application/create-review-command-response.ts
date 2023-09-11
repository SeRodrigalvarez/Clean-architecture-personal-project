import { CommandResponse } from 'src/modules/shared/domain';
import { CreateReviewCommand, ReviewCreatorResultStatus } from '.';

export class CreateReviewCommandResponse extends CommandResponse {
    constructor(readonly status: ReviewCreatorResultStatus) {
        super({ commandName: CreateReviewCommand.name });
    }
}
