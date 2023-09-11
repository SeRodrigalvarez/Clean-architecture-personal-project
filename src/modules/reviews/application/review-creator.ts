import { Inject, Injectable } from '@nestjs/common';
import {
    BusinessType,
    EVENT_BUS_PORT,
    EventBus,
    Id,
    QUERY_BUS_PORT,
    QueryBus,
    ReviewRating,
} from 'src/modules/shared/domain';
import {
    Review,
    ReviewRepository,
    ReviewText,
    REVIEW_REPOSITORY_PORT,
    Username,
    SaveResultStatus,
} from '../domain';
import { GetViewResultStatus as GetOnlineViewResultStatus } from 'src/modules/online-business/domain';
import { GetViewResultStatus as GetPhysicaViewlResultStatus } from 'src/modules/physical-business/domain';
import {
    GetOnlineBusinessByIdQuery,
    GetOnlineBusinessByIdQueryResponse,
} from 'src/modules/online-business/application';
import {
    GetPhysicalBusinessByIdQuery,
    GetPhysicalBusinessByIdQueryResponse,
} from 'src/modules/physical-business/application';

export interface ReviewCreatorResult {
    status: ReviewCreatorResultStatus;
}

export enum ReviewCreatorResultStatus {
    OK,
    NON_EXISTANT_BUSINESS_ID,
    DUPLICATED_REVIEW,
    GENERIC_ERROR,
}

@Injectable()
export class ReviewCreator {
    constructor(
        @Inject(REVIEW_REPOSITORY_PORT)
        private reviewRepository: ReviewRepository,
        @Inject(QUERY_BUS_PORT)
        private queryBus: QueryBus,
        @Inject(EVENT_BUS_PORT)
        private eventBus: EventBus,
    ) {}

    async execute(
        id: Id,
        businessId: Id,
        text: ReviewText,
        rating: ReviewRating,
        username: Username,
    ): Promise<ReviewCreatorResult> {
        // NOTE: Eventual consistency of read model could lead to race condition, but it's not our case
        const getOnlineBusinessResult: GetOnlineBusinessByIdQueryResponse =
            await this.queryBus.ask(
                new GetOnlineBusinessByIdQuery(businessId.value),
            );
        const getPhysicalBusinessResult: GetPhysicalBusinessByIdQueryResponse =
            await this.queryBus.ask(
                new GetPhysicalBusinessByIdQuery(businessId.value),
            );

        if (
            getOnlineBusinessResult.status ===
                GetOnlineViewResultStatus.GENERIC_ERROR ||
            getPhysicalBusinessResult.status ===
                GetPhysicaViewlResultStatus.GENERIC_ERROR
        ) {
            return {
                status: ReviewCreatorResultStatus.GENERIC_ERROR,
            };
        }

        if (
            getOnlineBusinessResult.status ===
                GetOnlineViewResultStatus.NOT_FOUND &&
            getPhysicalBusinessResult.status ===
                GetPhysicaViewlResultStatus.NOT_FOUND
        ) {
            return {
                status: ReviewCreatorResultStatus.NON_EXISTANT_BUSINESS_ID,
            };
        }

        const businessType: BusinessType =
            getOnlineBusinessResult.status === GetOnlineViewResultStatus.OK
                ? BusinessType.ONLINE
                : BusinessType.PHYSICAL;

        const review = Review.create(
            id,
            businessId,
            text,
            rating,
            username,
            businessType,
        );
        const saveResult = await this.reviewRepository.save(review);
        if (saveResult.status === SaveResultStatus.DUPLICATED_REVIEW) {
            return {
                status: ReviewCreatorResultStatus.DUPLICATED_REVIEW,
            };
        }
        if (saveResult.status === SaveResultStatus.GENERIC_ERROR) {
            return {
                status: ReviewCreatorResultStatus.GENERIC_ERROR,
            };
        }
        if (saveResult.status === SaveResultStatus.OK) {
            review
                .pullDomainEvents()
                .forEach((event) => this.eventBus.publish(event));
        }

        return {
            status: ReviewCreatorResultStatus.OK,
        };
    }
}
