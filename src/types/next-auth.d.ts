import {DefaultSession, DefaultUser} from "next-auth";
import {JWT} from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    sharedKey?: string;
    user: User & DefaultSession["user"];
    isNewUser?: boolean;
  }

  interface User extends DefaultUser {
    token: string;
    roles?: string[];
    session?: string;
    isNewUser?: boolean;
  }

  interface EventCallbacks {
    signOut: (message: {token: JWT | null}) => Promise<void> | void;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    email: string;
    roles?: string[];
    sharedKey?: string;
    session?: string;
    isNewUser?: boolean;
  }
}