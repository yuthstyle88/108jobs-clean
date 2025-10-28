import type {Comment} from "./Comment";
import type {CommentActions} from "./CommentActions";
import type {CommentReply} from "./CommentReply";
import type {Community} from "./Community";
import type {CommunityActions} from "./CommunityActions";
import type {InstanceActions} from "./InstanceActions";
import type {Person} from "./Person";
import type {PersonActions} from "./PersonActions";
import type {Post} from "./Post";
import type {TagsView} from "./TagsView";

/**
 * A comment reply view.
 */
export type CommentReplyView = {
  commentReply: CommentReply;
  recipient: Person;
  comment: Comment;
  creator: Person;
  post: Post;
  community: Community;
  communityActions?: CommunityActions;
  commentActions?: CommentActions;
  personActions?: PersonActions;
  instanceActions?: InstanceActions;
  creatorHomeInstanceActions?: InstanceActions;
  creatorLocalInstanceActions?: InstanceActions;
  creatorCommunityActions?: CommunityActions;
  creatorIsAdmin: boolean;
  postTags: TagsView;
  canMod: boolean;
  creatorBanned: boolean;
};
