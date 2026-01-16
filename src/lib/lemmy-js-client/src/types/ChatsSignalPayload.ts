import {ChatRoomId} from "./ChatRoomId";
import {PresenceJoin} from "./PresenceJoin";
import {PresenceLeave} from "./PresenceLeave";
import {PresenceStatus} from "./PresenceStatus";
import {LocalUserId} from "./LocalUserId";

export type ChatSignal = {
    kind: "chat";
    version: number;
    roomId: ChatRoomId;
    lastMessageId?: string;
    lastMessageAt?: string;
    unreadCount: number;
    senderId?: LocalUserId;
};

export type PresenceSignal = {
    kind: "presence";
    version: number;
    roomId?: ChatRoomId;
    joins: PresenceJoin[];
    leaves: PresenceLeave[];
};

export type GlobalPresenceSignal = {
    kind: "globalPresence";
    version: number;
    userId: LocalUserId;
    status: PresenceStatus;
    at: string;
    lastSeen?: string;
};

export type ChatsSignalPayload = ChatSignal | PresenceSignal | GlobalPresenceSignal;
