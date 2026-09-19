"use client";

import Link from "next/link";
import { ArrowLeftRight, Diamond, House, UserRound, WalletCards } from "lucide-react";

const items = [
  { label: "Dashboard", href: "/dashboard", icon: House },
  { label: "Buy Data", href: "/buy-data", icon: Diamond },
  { label: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { label: "Wallet", href: "/wallet", icon: WalletCards },
  { label: "Profile", href: "/profile", icon: UserRound },
];

type MobileBottomNavigationProps = {
  activePath: string;
};

export default function MobileBottomNavigation({ activePath }: MobileBottomNavigationProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-100 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 shadow-[0_-6px_20px_rgba(15,23,42,0.04)] backdrop-blur md:hidden" aria-label="Mobile navigation">
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {items.map(({ label, href, icon: Icon }) => {
          const active = activePath === href;
          return (
            <li key={label}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[10px] font-medium transition ${active ? "text-sky-600" : "text-slate-500 hover:text-slate-700"}`}
              >
                <Icon size={20} strokeWidth={active ? 2.4 : 2} />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
