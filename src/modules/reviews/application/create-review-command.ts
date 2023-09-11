import { Command } from 'src/modules/shared/domain';

export class CreateReviewCommand extends Command {
    constructor(
        readonly id: string,
        readonly businessId: string,
        readonly text: string,
        readonly rating: number,
        readonly username: string,
    ) {
        super({ commandName: CreateReviewCommand.name });
    }
}
