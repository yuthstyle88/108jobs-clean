"use client";
import React, {createContext, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";

export type AnnouncementType = "success" | "error" | "info";
export type Announcement = {
    id: string;
    message: string;
    type: AnnouncementType;
    createdAt: number;
};

type AnnouncementContextType = {
    announcements: Announcement[];
    announce: (message: string, type?: AnnouncementType) => string;
    dismiss: (id: string) => void;
    clearAll: () => void;
};

const AnnouncementContext = createContext<AnnouncementContextType | undefined>(undefined);

export const AnnouncementProvider = ({ children }: { children: React.ReactNode }) => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const counterRef = useRef(0);
    const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

    const announce = useCallback((message: string, type: AnnouncementType = "info") => {
        const id = `${Date.now()}-${counterRef.current++}`;
        setAnnouncements(prev => {
            const next: Announcement[] = [...prev, { id, message, type, createdAt: Date.now() }];
            // Keep a small history to avoid unbounded growth
            return next.slice(-5);
        });

        // Set a timeout to automatically dismiss the announcement after 5 seconds
        const timeoutId = setTimeout(() => {
            setAnnouncements(prev => prev.filter(a => a.id !== id));
            timeoutRefs.current.delete(id);
        }, 5000);

        // Store the timeout ID
        timeoutRefs.current.set(id, timeoutId);

        return id;
    }, []);

    const dismiss = useCallback((id: string) => {
        // Clear the timeout for the announcement being dismissed
        const timeoutId = timeoutRefs.current.get(id);
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutRefs.current.delete(id);
        }
        setAnnouncements(prev => prev.filter(a => a.id !== id));
    }, []);

    const clearAll = useCallback(() => {
        // Clear all timeouts
        timeoutRefs.current.forEach(timeoutId => clearTimeout(timeoutId));
        timeoutRefs.current.clear();
        setAnnouncements([]);
    }, []);

    // Cleanup timeouts on component unmount
    useEffect(() => {
        return () => {
            timeoutRefs.current.forEach(timeoutId => clearTimeout(timeoutId));
            timeoutRefs.current.clear();
        };
    }, []);

    const value = useMemo(() => ({ announcements, announce, dismiss, clearAll }), [announcements, announce, dismiss, clearAll]);

    return (
        <AnnouncementContext.Provider value={value}>
            {children}
        </AnnouncementContext.Provider>
    );
};

export const useAnnouncements = () => {
    const ctx = useContext(AnnouncementContext);
    if (!ctx) throw new Error("useAnnouncements must be used within an AnnouncementProvider");
    return ctx;
};