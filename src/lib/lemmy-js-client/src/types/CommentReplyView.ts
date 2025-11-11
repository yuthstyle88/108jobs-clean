import type {Comment} from "./Comment";
import type {CommentActions} from "./CommentActions";
import type {CommentReply} from "./CommentReply";
import type {Category} from "./Category";
import type {CategoryActions} from "./CategoryActions";
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
    category: Category;
    categoryActions?: CategoryActions;
    commentActions?: CommentActions;
    personActions?: PersonActions;
    instanceActions?: InstanceActions;
    creatorHomeInstanceActions?: InstanceActions;
    creatorLocalInstanceActions?: InstanceActions;
    creatorCategoryActions?: CategoryActions;
    creatorIsAdmin: boolean;
    postTags: TagsView;
    canMod: boolean;
    creatorBanned: boolean;
};
