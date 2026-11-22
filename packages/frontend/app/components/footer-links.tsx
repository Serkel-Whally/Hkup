import Link from "next/link";
import { FileText, Headset, Info, Shield } from "lucide-react";

const links = [
  { label: "Support", href: "/support", Icon: Headset },
  { label: "About", href: "/about", Icon: Info },
  { label: "Privacy", href: "/privacy", Icon: Shield },
  { label: "Terms and conditions", href: "/terms", Icon: FileText },
];

export function FooterLinks() {
  return (
    <nav className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm font-semibold text-slate-600 dark:text-slate-300 sm:flex sm:flex-wrap sm:gap-x-7 sm:gap-y-3" aria-label="Footer navigation">
      {links.map(({ label, href, Icon }) => (
        <Link key={href} href={href} className="inline-flex items-center gap-2 rounded-md transition-colors hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:hover:text-cyan-400">
          <Icon aria-hidden="true" size={16} />
          {label}
        </Link>
      ))}
    </nav>
  );
}
