import Link from "next/link";
import { FooterLinks } from "./footer-links";

export function InfoPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-5 py-5 sm:px-8">
          <Link href="/" className="text-xl font-bold tracking-tight text-sky-700">Cellulite Bundle</Link>
        </div>
      </header>
      <article className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        <div className="prose mt-8 max-w-none space-y-5 leading-7 text-slate-700">
          {children}
        </div>
        <Link href="/" className="mt-10 inline-flex rounded-xl bg-sky-600 px-5 py-3 font-semibold text-white hover:bg-sky-700">
          Back to home
        </Link>
      </article>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl flex-col gap-5 px-5 py-7 sm:px-8">
          <FooterLinks />
          <p className="text-sm text-slate-500">© {new Date().getFullYear()} Cellulite Bundle.</p>
        </div>
      </footer>
    </main>
  );
}
