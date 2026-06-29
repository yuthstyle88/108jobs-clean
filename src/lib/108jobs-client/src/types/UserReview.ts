import {UserReviewId} from "./UserReviewId";
import {LocalUserId} from "./LocalUserId";
import {WorkflowId} from "./WorkflowId";

export type UserReview = {
    id: UserReviewId;
    reviewerId: LocalUserId;
    revieweeId: LocalUserId;
    workflowId: WorkflowId;
    rating: number;
    comment: string | null;
    createdAt: string;
    updatedAt: string | null;
};