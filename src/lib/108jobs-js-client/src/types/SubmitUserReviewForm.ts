import {PersonId} from "./PersonId";

export type SubmitUserReviewForm = {
    revieweeId: PersonId;
    workflowId: PersonId;
    rating: number;
    comment?: string;
};