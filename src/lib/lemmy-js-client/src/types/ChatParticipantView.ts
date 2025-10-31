import {ChatParticipant} from "./ChatParticipant";
import {Person} from "./Person";

export type ChatParticipantView = {
    participant: ChatParticipant;
    memberPerson: Person;
};