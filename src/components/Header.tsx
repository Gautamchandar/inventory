"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types/inventory";
import {
  Shield,
  ShieldAlert,
  RefreshCw,
  Bell,
  Sparkles,
  LogOut,
  ChevronDown,
  Loader2,
} from "lucide-react";

interface HeaderProps {
  role: UserRole;
  userEmail?: string;
  userName?: string;
  onRoleChange: (newRole: UserRole) => void;
  alertCount: number;
  onOpenAlerts: () => void;
  onSyncWooCommerce: () => void;
  isSyncing: boolean;
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

export const Header: React.FC<HeaderProps> = ({
  role,
  userEmail,
  userName = "Admin Manager",
  alertCount,
  onOpenAlerts,
  onSyncWooCommerce,
  isSyncing,
}) => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isAdmin = role === "ADMIN";
  const RoleIcon = isAdmin ? Shield : ShieldAlert;

  // Close the user menu on outside click or Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
      setLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 mb-4 border-b border-slate-800/70 bg-slate-950/75 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/60 sm:mb-6">
      {/* Soft amber glow along the top edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-amber-500/[0.06] to-transparent"
      />

      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-3 sm:h-[72px] sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3.5">
          <div className="relative shrink-0">
            <div
              aria-hidden
              className="absolute -inset-1 rounded-2xl bg-amber-500/25 blur-md"
            />
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 shadow-lg shadow-amber-950/50 ring-1 ring-inset ring-amber-200/40 sm:h-11 sm:w-11">
              <Sparkles className="h-5 w-5 text-amber-950" strokeWidth={2.25} />
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate bg-gradient-to-r from-amber-100 via-amber-300 to-amber-100 bg-clip-text text-base font-bold tracking-tight text-transparent sm:text-xl">
                HBTX Professional
              </h1>
              <span className="hidden rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-300 md:inline-block">
                Live inventory
              </span>
            </div>

            <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-400 sm:text-xs">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="truncate">
                <span className="sm:hidden">WooCommerce connected</span>
                <span className="hidden sm:inline">
                  WooCommerce REST API and webhooks connected
                </span>
              </span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          {/* Sync */}
          <button
            type="button"
            onClick={onSyncWooCommerce}
            disabled={isSyncing}
            aria-label={isSyncing ? "Syncing with WooCommerce" : "Sync with WooCommerce"}
            title="Sync stock with the WooCommerce REST API"
            className={`group inline-flex h-10 w-10 items-center justify-center gap-2 rounded-xl border border-slate-700/70 bg-slate-900/70 text-sm font-medium text-slate-200 transition hover:border-amber-500/40 hover:bg-slate-800/80 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-3.5 ${focusRing}`}
          >
            <RefreshCw
              className={`h-4 w-4 text-amber-400 ${
                isSyncing
                  ? "animate-spin"
                  : "transition-transform duration-500 group-hover:rotate-180"
              }`}
            />
            <span className="hidden sm:inline">
              {isSyncing ? "Syncing…" : "Sync"}
              <span className="hidden lg:inline"> WooCommerce</span>
            </span>
          </button>

          {/* Alerts */}
          <button
            type="button"
            onClick={onOpenAlerts}
            aria-label={
              alertCount > 0 ? `Open alerts, ${alertCount} unread` : "Open alerts"
            }
            className={`relative inline-flex h-10 w-10 items-center justify-center gap-2 rounded-xl border border-slate-700/70 bg-slate-900/70 text-sm font-medium text-slate-200 transition hover:border-amber-500/40 hover:bg-slate-800/80 sm:w-auto sm:px-3.5 ${focusRing}`}
          >
            <Bell className="h-4 w-4 text-amber-400" />
            <span className="hidden sm:inline">Alerts</span>
            {alertCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-bold text-slate-950 shadow-md shadow-amber-950/50 ring-2 ring-slate-950 sm:static sm:ml-0.5 sm:shadow-none sm:ring-0">
                {alertCount > 99 ? "99+" : alertCount}
              </span>
            )}
          </button>

          <div
            aria-hidden
            className="mx-0.5 hidden h-7 w-px bg-slate-800 sm:block"
          />

          {/* User menu */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label="Open account menu"
              className={`flex h-10 items-center gap-2 rounded-xl border bg-slate-900/70 pl-1 pr-1 transition hover:border-amber-500/40 hover:bg-slate-800/80 sm:pr-2.5 ${focusRing} ${
                menuOpen
                  ? "border-amber-500/40 bg-slate-800/80"
                  : "border-slate-700/70"
              }`}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400/30 to-amber-700/30 text-xs font-bold text-amber-200 ring-1 ring-inset ring-amber-400/30">
                {getInitials(userName)}
              </span>
              <span className="hidden max-w-[9rem] flex-col items-start leading-tight md:flex">
                <span className="max-w-full truncate text-sm font-semibold text-slate-100">
                  {userName}
                </span>
                <span
                  className={`flex items-center gap-1 text-[11px] font-medium ${
                    isAdmin ? "text-amber-300" : "text-slate-400"
                  }`}
                >
                  <RoleIcon className="h-3 w-3" />
                  {role}
                </span>
              </span>
              <ChevronDown
                className={`hidden h-4 w-4 text-slate-400 transition-transform sm:block ${
                  menuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full z-50 mt-2 w-[min(18rem,calc(100vw-1.5rem))] origin-top-right overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/95 shadow-2xl shadow-black/60 backdrop-blur-xl motion-safe:animate-[menuIn_140ms_ease-out]"
              >
                <div className="flex items-center gap-3 border-b border-slate-800 p-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/30 to-amber-700/30 text-sm font-bold text-amber-200 ring-1 ring-inset ring-amber-400/30">
                    {getInitials(userName)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-100">
                      {userName}
                    </p>
                    {userEmail && (
                      <p className="truncate text-xs text-slate-400">
                        {userEmail}
                      </p>
                    )}
                    <span
                      className={`mt-1.5 inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-semibold ${
                        isAdmin
                          ? "border-amber-500/40 bg-amber-500/15 text-amber-300"
                          : "border-slate-700 bg-slate-800 text-slate-300"
                      }`}
                    >
                      <RoleIcon className="h-3 w-3" />
                      {role}
                    </span>
                  </div>
                </div>

                <div className="p-1.5">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-rose-500/10 hover:text-rose-300 focus-visible:bg-rose-500/10 focus-visible:text-rose-300 focus-visible:outline-none disabled:opacity-60"
                  >
                    {loggingOut ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="h-4 w-4" />
                    )}
                    {loggingOut ? "Signing out…" : "Sign out"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dropdown entrance animation */}
      <style jsx global>{`
        @keyframes menuIn {
          from {
            opacity: 0;
            transform: translateY(-4px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </header>
  );
};