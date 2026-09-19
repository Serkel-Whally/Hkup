"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowLeftRight, Diamond, Headset, House, LogOut, UserRound, WalletCards, X } from "lucide-react";
import { signOut } from "next-auth/react";

type NavigationDrawerProps = {
  open: boolean;
  activePath: string;
  onClose: () => void;
};

const links = [
  { label: "Dashboard", href: "/dashboard", icon: House },
  { label: "Buy Data", href: "/buy-data", icon: Diamond },
  { label: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { label: "Wallet", href: "/wallet", icon: WalletCards },
  { label: "Profile", href: "/profile", icon: UserRound },
  { label: "Support", href: "/support", icon: Headset },
];

export default function NavigationDrawer({ open, activePath, onClose }: NavigationDrawerProps) {
  const drawerRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = async () => {
    onClose();
    await signOut({ callbackUrl: "/login" });
  };

  useEffect(() => {
    if (!open) return;

    const drawer = drawerRef.current;
    const focusable = drawer?.querySelectorAll<HTMLElement>(
      "a, button, input, [tabindex]:not([tabindex='-1'])"
    ) || [];
    focusable[0]?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="md:hidden fixed inset-0 z-40" aria-hidden={!open}>
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div ref={drawerRef} className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-lg p-4 overflow-auto" role="dialog" aria-modal="true" aria-label="Main navigation">
        <div className="flex items-center justify-between">
          <Image src="/logo.png" alt="CelluLite Data" width={180} height={60} style={{ height: "auto" }} />
          <button onClick={onClose} aria-label="Close drawer"><X /></button>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2">
            {links.map(({ label, href, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onClose}
                  aria-current={activePath === href ? "page" : undefined}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${activePath === href ? "bg-sky-50 text-sky-600" : "text-slate-700 hover:bg-slate-50"}`}
                >
                  <span className="p-0.5" aria-hidden><Icon size={18} /></span>
                  <span>{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-6 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600" aria-hidden="true">
              <LogOut size={18} />
            </span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}