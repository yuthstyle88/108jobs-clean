"use client";
import React, {createContext, useContext, useMemo} from "react";
import {UserService} from "@/services/UserService";
import {getIsoData} from "@/hooks/data/useIsoData";
import {useUserStore} from "@/store/useUserStore";

// Instance type for the singleton user service
type UserClient = UserService;

interface UserServiceContextType {
  user: UserClient;
}

const UserServiceContext = createContext<UserServiceContextType | undefined>(
  undefined
);

interface UserServiceProviderProps {
  children: React.ReactNode;
  token?: string;
}

export function UserServiceProvider({children, token}: UserServiceProviderProps) {
  // Use the singleton instance
  const iso = getIsoData()?.myUserInfo ?? null;
  const setUser = useUserStore((s) => s.setUser);
  const setPerson = useUserStore((s) => s.setPerson);
  const setUserInfo = useUserStore((s) => s.setUserInfo);
  const user = UserService.Instance;

  // Seed the global store once on mount (after login redirect)
  if(iso) {
    setUser(iso.localUserView?.localUser ?? null);
    setPerson(iso.localUserView?.person ?? null);
    setUserInfo(iso ?? null);
  }

  (async () => {
    try {
      // If your UserService has a way to seed token, do it here (optional)
      // e.g., user.setToken?.(token as string);
      if(token && typeof (user as any).setToken === "function") {
        await (user as any).setToken(token);
      }
    } catch (e) {
      // no-op: token seeding is optional
    }
  })();
  const value = useMemo<UserServiceContextType>(() => ({user}), [user]);

  return (
    <UserServiceContext.Provider value={value}>
      {children}
    </UserServiceContext.Provider>
  );
}

// Hook สำหรับใช้งานใน component อื่น ๆ
export function useUserService(): UserClient {
  const ctx = useContext(UserServiceContext);
  if(!ctx) {
    throw new Error("useUserService must be used within UserServiceProvider");
  }
  return ctx.user;
}