"use client";
import {useEffect, useState} from "react";
import {isBrowser} from "@/utils";

/**
 * Simple network status hook using the browser's navigator.onLine and
 * online/offline events. Returns a boolean `online`.
 *
 * This reflects app connectivity, not per-user presence.
 */
export function useNetworkStatus() {
  const [online, setOnline] = useState<boolean>(true);

  useEffect(() => {
    if (!isBrowser()) return;
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  return { online };
}
