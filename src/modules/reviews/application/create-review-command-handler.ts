import {
    COMMAND_BUS_PORT,
    CommandBus,
    CommandHandler,
    Id,
    ReviewRating,
} from 'src/modules/shared/domain';
import {
    CreateReviewCommand,
    CreateReviewCommandResponse,
    ReviewCreator,
} from '.';
import { Inject, Injectable } from '@nestjs/common';
import { ReviewText, Username } from '../domain';

@Injectable()
export class CreateReviewCommandHandler
    implements CommandHandler<CreateReviewCommand, CreateReviewCommandResponse>
{
    constructor(
        private reviewCreator: ReviewCreator,
        @Inject(COMMAND_BUS_PORT) private commandBus: CommandBus,
    ) {
        this.commandBus.addHandler(CreateReviewCommand.name, this);
    }

    async execute(
        command: CreateReviewCommand,
    ): Promise<CreateReviewCommandResponse> {
        const result = await this.reviewCreator.execute(
            Id.createFrom(command.id),
            Id.createFrom(command.businessId),
            new ReviewText(command.text),
            new ReviewRating(command.rating),
            new Username(command.username),
        );

        return new CreateReviewCommandResponse(result.status);
    }
}
