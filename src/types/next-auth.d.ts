import {DefaultSession, DefaultUser} from "next-auth";

declare module "next-auth" {
    interface User extends DefaultUser {
        token: string;
        roles?: string[];
        session?: string;
        isNewUser?: boolean;
    }
}
