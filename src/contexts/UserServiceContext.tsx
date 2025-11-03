"use client";
import React, {createContext, useContext, useMemo, useRef, useLayoutEffect, useState} from "react";
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
  const setRoom = useRoomsStore((s) => s.setRooms);
  const user = UserService.Instance;

  const seededRef = useRef(false);
  const [ready, setReady] = useState(false);

  // Run-once hydration: useLayoutEffect so it happens before paint (earlier than useEffect)
  useLayoutEffect(() => {
    if (seededRef.current) return;
    seededRef.current = true;

    // Seed user/person/userInfo from ISO snapshot
    if (isoMyUser) {
      setUser(isoMyUser.localUserView?.localUser ?? null);
      setPerson(isoMyUser.localUserView?.person ?? null);
      setUserInfo(isoMyUser);
      setRoom(isoRooms);
    }

    // Apply token as early as possible; fire-and-forget if async
    (async () => {
      try {
        if (token && typeof (user as any).setToken === "function") {
          await (user as any).setToken(token);
        }
      } catch {}
    })();

    // Now allow children to render after parent has seeded everything
    setReady(true);
  }, [isoMyUser, token, user, setUser, setPerson, setUserInfo]);

  const value = useMemo<UserServiceContextType>(() => ({user}), [user]);

  return (
    <UserServiceContext.Provider value={value}>
      {ready ? children : null}
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