"use client";

import React from "react";
import { Bell } from "lucide-react";

type NotificationBellProps = {
  count?: number;
  onClick?: () => void;
  active?: boolean;
  className?: string;
};

export default function NotificationBell({
  count = 0,
  onClick,
  active = false,
  className = "",
}: NotificationBellProps) {
  const baseClasses =
    "relative inline-flex items-center justify-center h-9 w-9 rounded-md transition-colors";
  const stateClasses = active
    ? "text-green-600 bg-green-50"
    : "text-gray-600 hover:text-green-600 hover:bg-green-50";

  return (
    <button
      type="button"
      aria-label="Notifications"
      onClick={onClick}
      className={`${baseClasses} ${stateClasses} ${className}`}
    >
      <Bell className="h-4 w-4" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-red-500 text-[10px] leading-3 text-white flex items-center justify-center shadow-sm">
          {count}
        </span>
      )}
      {count > 0 && (
        <span className="absolute inset-0 rounded-md ring-2 ring-red-400/30 animate-pulse pointer-events-none" />
      )}
    </button>
  );
}


