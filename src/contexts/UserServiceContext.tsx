"use client";
import React, {createContext, useContext, useMemo, useRef, useLayoutEffect} from "react";
import {UserService} from "@/services/UserService";
import {getIsoData} from "@/hooks/data/useIsoData";
import {useUserStore} from "@/store/useUserStore";
import {useRoomsStore} from "@/modules/chat/store/roomsStore";
import {RoomView} from "@/modules/chat/types";

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
  // Snapshot ISO data once per mount
  const isoMyUser = useMemo(() => getIsoData()?.myUserInfo ?? null, []);
  const isoRooms: RoomView[] = useMemo(
    () => ((getIsoData()?.chatRooms?.rooms ?? []).map(r => ({...r, isActive: false})) as RoomView[]),
    []
  );

  const setUser = useUserStore((s) => s.setUser);
  const setPerson = useUserStore((s) => s.setPerson);
  const setUserInfo = useUserStore((s) => s.setUserInfo);
  const markHydrated = useRoomsStore((s) => s.markHydrated);
  const user = UserService.Instance;

  const seededRef = useRef(false);

  // Run-once hydration: useLayoutEffect so it happens before paint (earlier than useEffect)
  useLayoutEffect(() => {
    if (seededRef.current) return;
    seededRef.current = true;

    // Seed user/person/userInfo from ISO snapshot
    if (isoMyUser) {
      setUser(isoMyUser.localUserView?.localUser ?? null);
      setPerson(isoMyUser.localUserView?.person ?? null);
      setUserInfo(isoMyUser);
    }

    // Mark chat store hydrated (rooms seeding can be added here if needed)
    markHydrated();
  }, [isoMyUser, setUser, setPerson, setUserInfo, markHydrated]);

  // Apply token as early as possible in the same commit cycle
  useLayoutEffect(() => {
    if (!token) return;
    const maybeSetToken = (user as any)?.setToken;
    // Prefer a synchronous setter if available; otherwise, fire-and-forget
    if (typeof maybeSetToken === "function") {
      const r = maybeSetToken(token);
      // If it returns a Promise, we intentionally do not await to avoid delaying paint
      void r;
    } else {
      // Fallback: attach directly if the service supports it
      (user as any).token = token;
    }
  }, [token, user]);

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