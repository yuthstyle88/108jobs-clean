import {Review} from "./Review";

export type ReviewResponse = {
  profileId: string;
  reviewerId: string;
  content: string;
  rating: number;
  reviewerName: string;
  reviewerAvatar: string;
  reviews: Array<Review>;
  isOwner: string;
}