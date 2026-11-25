"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Search, ShieldCheck, SlidersHorizontal, Wifi } from "lucide-react";
import { getAuthSession } from "@/app/lib/auth";

const NETWORKS = [
  { id: "mtn", name: "MTN", logo: "/mtn.svg", tone: "border-amber-200 bg-amber-50" },
  { id: "telecel", name: "Telecel", logo: "/Telecel_Group.png", tone: "border-rose-200 bg-rose-50" },
  { id: "airtel", name: "AirtelTigo", logo: "/airtel.svg", tone: "border-blue-200 bg-blue-50" },
];
const CATEGORIES = ["All bundles", "Data Bundles", "Mega Bundles", "Night Bundles"] as const;
type Category = (typeof CATEGORIES)[number];
type Bundle = { bundleId: string; network: string; size: string; validity: string; price: number; isPopular?: boolean; active?: boolean };

function getCategory(bundle: Bundle): Exclude<Category, "All bundles"> {
  if (/night/i.test(bundle.validity)) return "Night Bundles";
  if (/^(?:[3-9]\d|\d{3,})GB$/i.test(bundle.size)) return "Mega Bundles";
  return "Data Bundles";
}

function formatPrice(price: number) {
  return `GH₵ ${Number(price).toFixed(2)}`;
}

export default function PublicBundlesPage() {
  const router = useRouter();
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [network, setNetwork] = useState("mtn");
  const [category, setCategory] = useState<Category>("All bundles");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadBundles() {
    setLoading(true);
    setError("");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/bundles`, { cache: "no-store" });
      if (!response.ok) throw new Error("We couldn't load the bundle catalogue.");
      const data = await response.json() as Bundle[];
      setBundles(data.filter((bundle) => bundle.active !== false && Number.isFinite(Number(bundle.price)) && Number(bundle.price) > 0));
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't load the bundle catalogue.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadBundles(); }, []);

  const selectedNetwork = NETWORKS.find((item) => item.id === network) ?? NETWORKS[0];
  const visibleBundles = useMemo(() => {
    const term = search.trim().toLowerCase();
    return bundles
      .filter((bundle) => bundle.network === selectedNetwork.name)
      .filter((bundle) => category === "All bundles" || getCategory(bundle) === category)
      .filter((bundle) => !term || [bundle.size, bundle.validity, formatPrice(bundle.price)].some((value) => value.toLowerCase().includes(term)))
      .sort((a, b) => Number(b.isPopular) - Number(a.isPopular) || Number(a.price) - Number(b.price));
  }, [bundles, selectedNetwork.name, category, search]);

  function buyBundle(bundle: Bundle) {
    const checkoutPath = `/checkout?bundle=${encodeURIComponent(bundle.bundleId)}`;
    if (!getAuthSession()?.token) {
      router.push(`/login?next=${encodeURIComponent(checkoutPath)}`);
      return;
    }
    router.push(checkoutPath);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500" aria-label="CelluLite Bundle home">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-sky-50 ring-1 ring-sky-100 dark:bg-sky-950 dark:ring-sky-900"><Image src="/cellulite_logo_icon.svg" alt="" width={34} height={34} className="h-8 w-8 object-contain" /></span>
            <span className="truncate text-[15px] font-extrabold tracking-tight sm:text-lg">CelluLite <span className="text-sky-600 dark:text-cyan-400">Bundle</span></span>
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            <Link href="/" className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900 sm:inline-flex">Home</Link>
            <Link href="/login" className="inline-flex min-h-10 items-center justify-center rounded-xl px-3 text-sm font-bold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900">Log in</Link>
            <Link href="/signup" className="inline-flex min-h-10 items-center justify-center rounded-xl bg-sky-600 px-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-sky-700">Create account</Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12 lg:px-8">
        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-sky-700 via-sky-600 to-cyan-500 px-5 py-7 text-white shadow-lg shadow-sky-900/10 sm:px-8 sm:py-9">
          <div aria-hidden="true" className="absolute -right-12 -top-24 h-64 w-64 rounded-full border-[34px] border-white/10" />
          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.13em] text-sky-50"><Wifi size={13} /> Public bundle catalogue</span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">Find the right data bundle.</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-sky-50 sm:text-base">Compare available bundles across Ghana's major networks. Browse freely — sign in only when you're ready to buy.</p>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-semibold text-white/90">
              <span className="inline-flex items-center gap-1.5"><ShieldCheck size={15} /> Current catalogue prices</span>
              <span className="inline-flex items-center gap-1.5"><Check size={15} /> No account needed to browse</span>
            </div>
          </div>
        </section>

        <section className="mt-8" aria-labelledby="network-heading">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div><p className="text-xs font-bold uppercase tracking-[0.15em] text-sky-700 dark:text-cyan-400">Step 1</p><h2 id="network-heading" className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">Choose a network</h2></div>
            <span className="text-xs text-slate-500 dark:text-slate-400">{bundles.length} available bundles</span>
          </div>
          <div className="grid grid-cols-3 gap-2.5 sm:max-w-2xl sm:gap-4">
            {NETWORKS.map((item) => {
              const active = network === item.id;
              return <button key={item.id} type="button" onClick={() => setNetwork(item.id)} aria-pressed={active} className={`relative flex min-h-[104px] flex-col items-center justify-center gap-2 rounded-2xl border-2 bg-white px-2 py-3 transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:bg-slate-900 sm:min-h-[132px] ${active ? "border-sky-600 bg-sky-50 shadow-sm dark:border-cyan-500 dark:bg-sky-950/40" : "border-slate-200 dark:border-slate-800"}`}>
                {active ? <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-sky-600 text-white"><Check size={12} strokeWidth={3} /></span> : null}
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl border p-1.5 sm:h-14 sm:w-14 ${item.tone}`}><Image src={item.logo} alt="" width={44} height={44} className="h-full w-full object-contain" /></span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 sm:text-sm">{item.name}</span>
              </button>;
            })}
          </div>
        </section>

        <section className="mt-9" aria-labelledby="bundles-heading">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-xs font-bold uppercase tracking-[0.15em] text-sky-700 dark:text-cyan-400">Step 2</p><h2 id="bundles-heading" className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">{selectedNetwork.name} bundles</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Choose a size and validity that works for you.</p></div>
            <label className="flex min-h-11 w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 shadow-sm transition focus-within:border-sky-300 focus-within:ring-2 focus-within:ring-sky-100 dark:border-slate-800 dark:bg-slate-900 sm:max-w-xs">
              <Search size={17} className="shrink-0 text-slate-400" /><span className="sr-only">Search bundles</span>
              <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search size, validity or price" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400" />
              {search ? <button type="button" onClick={() => setSearch("")} className="text-xs font-semibold text-sky-700 dark:text-cyan-400">Clear</button> : null}
            </label>
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Filter bundle categories">
            {CATEGORIES.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={category === item} className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${category === item ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"}`}>{item}</button>)}
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{loading ? "Loading bundles…" : `${visibleBundles.length} bundles`}</p>
            <span className="text-xs text-slate-500 dark:text-slate-400">Prices in Ghana cedis</span>
          </div>

          {loading ? <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" role="status" aria-label="Loading bundle catalogue">{Array.from({ length: 10 }).map((_, index) => <div key={index} className="min-h-[166px] animate-pulse rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"><div className="h-3 w-16 rounded bg-slate-200 dark:bg-slate-700" /><div className="mt-6 h-8 w-20 rounded bg-slate-200 dark:bg-slate-700" /><div className="mt-3 h-3 w-24 rounded bg-slate-200 dark:bg-slate-700" /><div className="mt-6 h-4 w-16 rounded bg-slate-200 dark:bg-slate-700" /></div>)}</div>
          : error ? <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-9 text-center dark:border-rose-900 dark:bg-rose-950/30" role="alert"><p className="font-semibold text-rose-800 dark:text-rose-200">{error}</p><button type="button" onClick={() => void loadBundles()} className="mt-4 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-rose-700 shadow-sm ring-1 ring-rose-200 hover:bg-rose-100 dark:bg-slate-900 dark:text-rose-300">Try again</button></div>
          : visibleBundles.length ? <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
              {visibleBundles.map((bundle) => <article key={bundle.bundleId} className="relative flex min-h-[178px] flex-col justify-between rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-lg hover:shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 sm:min-h-[190px] sm:p-4">
                {bundle.isPopular ? <span className="absolute -top-2 left-3 rounded-full bg-emerald-500 px-2.5 py-1 text-[9px] font-extrabold tracking-wide text-white">POPULAR</span> : null}
                <div><div className="text-[26px] font-extrabold leading-none tracking-[-0.05em] text-slate-950 dark:text-white sm:text-3xl">{bundle.size}</div><p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{bundle.validity.replace(" Validity", "")}</p></div>
                <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Price</p><p className="mt-1 text-base font-extrabold tracking-tight text-slate-900 dark:text-white">{formatPrice(bundle.price)}</p></div>
                <button type="button" onClick={() => buyBundle(bundle)} className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-sky-600 px-2 text-xs font-bold text-white transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2">Buy bundle <ArrowRight size={14} /></button>
              </article>)}
            </div>
          : <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center dark:border-slate-800 dark:bg-slate-900"><span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800"><SlidersHorizontal size={20} /></span><h3 className="mt-3 font-bold text-slate-900 dark:text-white">{search ? "No matching bundles" : "No bundles in this category"}</h3><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Try another category, network or search term.</p><button type="button" onClick={() => { setCategory("All bundles"); setSearch(""); }} className="mt-4 text-sm font-bold text-sky-700 hover:text-sky-800 dark:text-cyan-400">Clear filters</button></div>}
        </section>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-center dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:text-left">
          <div><p className="font-bold text-slate-900 dark:text-white">Ready to make a purchase?</p><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Create an account to complete checkout and keep track of your orders.</p></div>
          <Link href="/signup" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">Create account <ArrowRight size={15} /></Link>
        </div>
      </div>
    </main>
  );
}
