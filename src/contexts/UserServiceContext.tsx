"use client";
import React, {createContext, useContext, useMemo, useEffect, useRef} from "react";
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
      () => ((getIsoData()?.chatRooms?.rooms ?? []).map(r => ({ ...r, isActive: false })) as RoomView[]),
      []
    );

    const setUser = useUserStore((s) => s.setUser);
    const setPerson = useUserStore((s) => s.setPerson);
    const setUserInfo = useUserStore((s) => s.setUserInfo);
    const setRooms = useRoomsStore((s) => s.setRooms);
    const markHydrated = useRoomsStore((s) => s.markHydrated);
    const hydrateRooms = useRoomsStore((s) => s.hydrateRooms);
    const user = UserService.Instance;

    const seededRef = useRef(false);
    useEffect(() => {
      if (seededRef.current) return;
      seededRef.current = true;

      if (isoMyUser) {
        setUser(isoMyUser.localUserView?.localUser ?? null);
        setPerson(isoMyUser.localUserView?.person ?? null);
        setUserInfo(isoMyUser);
      }

      // Seed rooms from ISO (fallback to empty array)
      hydrateRooms(Array.isArray(isoRooms) ? isoRooms : []);
      markHydrated();
    }, [isoMyUser, isoRooms, setUser, setPerson, setUserInfo, setRooms, markHydrated, hydrateRooms]);

    useEffect(() => {
      let cancelled = false;
      (async () => {
        try {
          if (token && typeof (user as any).setToken === "function" && !cancelled) {
            await (user as any).setToken(token);
          }
        } catch {}
      })();
      return () => { cancelled = true; };
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
    if (!ctx) {
        throw new Error("useUserService must be used within UserServiceProvider");
    }
    return ctx.user;
}