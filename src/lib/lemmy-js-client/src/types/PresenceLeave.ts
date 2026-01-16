import {LocalUserId} from "./LocalUserId";

export type PresenceLeave = {
    userId: LocalUserId;
    lastSeen: string;
};
