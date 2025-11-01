import {ChatRoomView} from "lemmy-js-client";

// Each Room represents a 1-to-1 conversation, so it has exactly one participant besides the current user.
export type RoomView = ChatRoomView & {
    isActive: boolean;
};
