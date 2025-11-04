"use client";
import React, {createContext, useContext, useMemo, useRef, useLayoutEffect, useState} from "react";
import {UserService} from "@/services/UserService";
import {useUserStore} from "@/store/useUserStore";
import {useRoomsStore} from "@/modules/chat/store/roomsStore";
import {RoomView} from "@/modules/chat/types";
import {useGlobalLoader} from "@/hooks/ui/GlobalLoaderContext";
import {IsoData} from "@/utils";

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
  isoData: IsoData | null
}

export function UserServiceProvider({children, isoData}: UserServiceProviderProps) {
  // Snapshot ISO data once per mount
  const isoMyUser = useMemo(() => isoData ?? null, []);
  const token = isoData?.jwt ?? null;
  const isoRooms: RoomView[] = useMemo(
    () => ((isoMyUser?.chatRooms?.rooms ?? []).map(r => ({...r, isActive: false})) as RoomView[]),
    []
  );

  const setUser = useUserStore((s) => s.setUser);
  const setPerson = useUserStore((s) => s.setPerson);
  const setUserInfo = useUserStore((s) => s.setUserInfo);
  const setRoom = useRoomsStore((s) => s.setRooms);
  const user = UserService.Instance;

  const seededRef = useRef(false);
  const [ready, setReady] = useState(false);

  const { showLoader, hideLoader } = useGlobalLoader();

  // Run-once hydration: useLayoutEffect so it happens before paint (earlier than useEffect)
  useLayoutEffect(() => {
    if (seededRef.current) return;
    seededRef.current = true;

    // Seed user/person/userInfo from ISO snapshot
    if (isoMyUser) {
      setUser(isoMyUser?.myUserInfo?.localUserView?.localUser ?? null);
      setPerson(isoMyUser?.myUserInfo?.localUserView?.person ?? null);
      setUserInfo(isoMyUser.myUserInfo ?? null);
      setRoom(isoRooms);
    }

    showLoader();
    (async () => {
      try {
        if (token && typeof (user as any).setToken === "function") {
          await (user as any).setToken(token);
        }
      } catch {} finally {
        hideLoader();
        setReady(true);
      }
    })();
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