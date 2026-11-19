import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

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
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="hidden text-xl font-bold tracking-tight text-sky-700 sm:inline-flex">Cellulite Bundle</Link>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login" className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Log in</Link>
          </div>
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
    </main>
  );
}
