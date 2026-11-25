import Link from "next/link";

export function InfoPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <article className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">
          <span aria-hidden="true">←</span> Back to home
        </Link>
        <header className="mt-6 border-b border-slate-200 pb-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-600">CelluLite Bundle · Help centre</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Clear information to help you use the service and manage your orders.</p>
        </header>
        <div className="prose mt-7 max-w-none space-y-7 text-[15px] leading-7 text-slate-700">
          {children}
        </div>
        <footer className="mt-12 flex flex-col gap-3 border-t border-slate-200 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-slate-500">Need help with an order?</p>
          <div className="flex flex-wrap gap-4 font-semibold">
            <Link href="/support" className="text-sky-700 hover:text-sky-800">Support</Link>
            <Link href="/terms" className="text-sky-700 hover:text-sky-800">Terms</Link>
            <Link href="/privacy" className="text-sky-700 hover:text-sky-800">Privacy</Link>
          </div>
        </footer>
      </article>
    </main>
  );
}
