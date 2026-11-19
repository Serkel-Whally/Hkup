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
    <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-slate-600 dark:text-slate-300" aria-label="Footer navigation">
      {links.map(({ label, href, Icon }) => (
        <Link key={href} href={href} className="inline-flex items-center gap-2 hover:text-sky-700 dark:hover:text-lime-400">
          <Icon aria-hidden="true" size={16} />
          {label}
        </Link>
      ))}
    </nav>
  );
}
