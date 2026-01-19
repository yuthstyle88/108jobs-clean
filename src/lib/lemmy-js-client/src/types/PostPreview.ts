import {PostId} from "./PostId";
import {LanguageId} from "./LanguageId";
import {PersonId} from "./PersonId";

export interface PostPreview {
    id: PostId;
    name: string;
    budget: number;
    languageId: LanguageId;
    deadline?: string;
    creatorId: PersonId;
}
