"use client";
import React from "react";
import {useAnnouncements} from "@/contexts/AnnouncementContext";

// A minimal, accessible announcement panel with an aria-live region and a
// small persistent, dismissible list. Designed to be non-intrusive.
const AccessibleAnnouncements: React.FC = () => {
  const {announcements, dismiss} = useAnnouncements();

  const last = announcements[announcements.length - 1];

  return (
    <>
      {/* Visually hidden aria-live region for screen readers */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {last?.message || ""}
      </div>

      {/* Visible, non-intrusive panel */}
      {announcements.length > 0 && (
        <div className="fixed bottom-3 left-3 z-40 space-y-2 max-w-sm w-[92vw] sm:w-80">
          {announcements.map(a => (
            <div
              key={a.id}
              role="status"
              aria-label={a.type}
              className={
                `rounded-md border shadow-sm px-3 py-2 text-sm flex items-start justify-between gap-3 ` +
                (a.type === "success" ? "bg-green-50 border-green-200 text-green-900" :
                 a.type === "error" ? "bg-red-50 border-red-200 text-red-900" :
                 "bg-slate-50 border-slate-200 text-slate-900")
              }
            >
              <span className="leading-5">{a.message}</span>
              <button
                onClick={() => dismiss(a.id)}
                className="shrink-0 rounded px-2 py-1 text-xs border border-current/20 hover:bg-white/40"
                aria-label="Dismiss announcement"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default AccessibleAnnouncements;
