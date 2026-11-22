"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import Image from "next/image";
import { DashboardShell } from "@/app/components/dashboard-shell";
import { CheckoutPage } from "@/app/checkout/checkout-form";

const NETWORKS = [
  { id: "mtn", name: "MTN", logo: "/mtn.svg" },
  { id: "telecel", name: "Telecel", logo: "/Telecel_Group.png" },
  { id: "airtel", name: "AirtelTigo", logo: "/airtel.svg" },
];

const PLAN_CATEGORIES = ["Data Bundles", "Mega Bundles", "Night Bundles"];

type Bundle = {
  id: string;
  size: string;
  validity: string;
  price: string;
  popular: boolean;
};
type BundleData = Record<string, Record<string, Bundle[]>>;

export default function BuyDataPage() {
  const router = useRouter();
  const [selectedNetwork, setSelectedNetwork] = useState<string>("mtn");
  const [selectedPlan, setSelectedPlan] = useState<string>("Data Bundles");
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null);
  const [bundleData, setBundleData] = useState<BundleData>({});
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState("");
  const [checkoutDetails, setCheckoutDetails] = useState<{
    network: string;
    bundleId: string;
    size: string;
    validity: string;
    price: string;
  } | null>(null);

  useEffect(() => {
    const loadBundles = async () => {
      setCatalogLoading(true);
      setCatalogError("");
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await fetch(`${apiUrl}/api/bundles`);
        if (!response.ok) throw new Error("Unable to load bundles");
        const bundles = await response.json() as Array<{
          bundleId: string;
          network: string;
          size: string;
          validity: string;
          price: number;
          isPopular: boolean;
        }>;
        const grouped: BundleData = {};

        for (const bundle of bundles) {
          const networkId = NETWORKS.find((network) => network.name === bundle.network)?.id;
          if (!networkId) continue;
          const category = /night/i.test(bundle.validity)
            ? "Night Bundles"
            : /^(?:[3-9]\\d|\\d{3,})GB$/i.test(bundle.size)
              ? "Mega Bundles"
              : "Data Bundles";
          grouped[networkId] ??= {};
          grouped[networkId][category] ??= [];
          grouped[networkId][category].push({
            id: bundle.bundleId,
            size: bundle.size,
            validity: bundle.validity,
            price: `GH₵ ${Number(bundle.price).toFixed(2)}`,
            popular: Boolean(bundle.isPopular),
          });
        }

        setBundleData(grouped);
      } catch (error) {
        setCatalogError(error instanceof Error ? error.message : "Unable to load bundles");
      } finally {
        setCatalogLoading(false);
      }
    };

    loadBundles();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const networkParam = params.get("network");
    const bundleParam = params.get("bundle");

    if (networkParam && NETWORKS.some((n) => n.id === networkParam)) {
      setSelectedNetwork(networkParam);
      if (bundleParam) {
        const plans = Object.keys(bundleData[networkParam] || {});
        for (const p of plans) {
          const found = bundleData[networkParam][p].some((b) => b.id === bundleParam);
          if (found) {
            setSelectedPlan(p);
            setSelectedBundle(bundleParam);
            break;
          }
        }
      } else {
        setSelectedBundle(null);
      }
    } else if (bundleParam) {
      let found = false;
      for (const net of Object.keys(bundleData)) {
        for (const p of Object.keys(bundleData[net])) {
          const exists = bundleData[net][p].some((b) => b.id === bundleParam);
          if (exists) {
            setSelectedNetwork(net);
            setSelectedPlan(p);
            setSelectedBundle(bundleParam);
            found = true;
            break;
          }
        }
        if (found) break;
      }
    }
  }, [bundleData]);

  const currentBundles = bundleData[selectedNetwork]?.[selectedPlan] || [];

  const handleBundleSelect = (bundleId: string) => {
    const bundle = currentBundles.find((b) => b.id === bundleId);
    if (bundle) {
      setSelectedBundle(bundleId);
      if (typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches) {
        setCheckoutDetails({
          network: selectedNetwork,
          bundleId,
          size: bundle.size,
          validity: bundle.validity,
          price: bundle.price,
        });
        return;
      }

      router.push(
        `/checkout?network=${selectedNetwork}&bundle=${bundleId}&size=${encodeURIComponent(bundle.size)}&validity=${encodeURIComponent(bundle.validity)}&price=${encodeURIComponent(bundle.price)}`
      );
    }
  };

  return (
    <DashboardShell active="/buy-data">
      <main className="mx-auto max-w-7xl space-y-10 bg-white px-4 py-6 sm:px-6 md:px-10 md:py-8">
        <section aria-labelledby="network-heading">
          <div className="mb-5">
            <h2 id="network-heading" className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
              Select Network
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Choose the mobile network you want to buy data for.
            </p>
          </div>

          <div
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:max-w-2xl md:grid-cols-3 md:gap-5 md:overflow-visible md:pb-0"
            role="group"
            aria-label="Available mobile networks"
          >
            {NETWORKS.map((network) => (
              <button
                key={network.id}
                type="button"
                onClick={() => {
                  setSelectedNetwork(network.id);
                  setSelectedBundle(null);
                }}
                className={`relative flex min-h-[124px] min-w-[148px] snap-start shrink-0 flex-col items-center justify-center rounded-2xl border-2 px-3 py-3 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 sm:min-h-[136px] sm:min-w-[160px] md:min-w-0 md:min-h-[150px] md:py-4 ${
                  selectedNetwork === network.id
                    ? "border-sky-600 bg-sky-50 shadow-[0_8px_20px_rgba(14,165,233,0.12)]"
                    : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
                }`}
                aria-pressed={selectedNetwork === network.id}
                aria-label={`Select ${network.name} network`}
              >
                {selectedNetwork === network.id && (
                  <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-sky-600">
                    <Check size={14} className="text-white" strokeWidth={3} aria-hidden="true" />
                  </span>
                )}
                <span className="mb-2 flex h-11 w-12 items-center justify-center sm:h-14 sm:w-14 md:mb-3 md:h-16 md:w-16">
                  <Image
                    src={network.logo}
                    alt=""
                    width={48}
                    height={48}
                    className="h-10 w-10 object-contain sm:h-12 sm:w-12 md:h-14 md:w-14"
                  />
                </span>
                <span className="whitespace-nowrap text-sm font-semibold text-slate-900 md:text-base">
                  {network.name}
                </span>
                {selectedNetwork === network.id && (
                  <span className="mt-1 text-[11px] font-medium text-sky-700">Selected</span>
                )}
              </button>
            ))}
          </div>
        </section>

        <section aria-labelledby="plans-heading">
          <div className="mb-5">
            <h2 id="plans-heading" className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
              Choose a Plan
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Select a bundle that suits your data needs.
            </p>
          </div>

          <div
            className="mb-7 flex gap-7 overflow-x-auto border-b border-slate-200"
            role="group"
            aria-label="Bundle categories"
          >
            {PLAN_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => {
                  setSelectedPlan(category);
                  setSelectedBundle(null);
                }}
                className={`whitespace-nowrap border-b-2 pb-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-500 sm:text-base ${
                  selectedPlan === category
                    ? "border-sky-600 text-sky-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
                aria-pressed={selectedPlan === category}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
            {catalogLoading ? (
              <div className="col-span-full grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6" role="status" aria-live="polite">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="min-h-[142px] animate-pulse rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:min-h-[154px]">
                    <div className="h-3 w-16 rounded bg-slate-200" />
                    <div className="mt-5 h-8 w-20 rounded bg-slate-200" />
                    <div className="mt-3 h-3 w-24 rounded bg-slate-200" />
                    <div className="mt-5 border-t border-slate-200 pt-3">
                      <div className="h-4 w-16 rounded bg-slate-200" />
                    </div>
                  </div>
                ))}
                <span className="sr-only">Loading available bundles</span>
              </div>
            ) : catalogError ? (
              <div className="col-span-full rounded-2xl border border-rose-100 bg-rose-50 px-5 py-8 text-center" role="alert">
                <p className="font-semibold text-rose-800">We couldn’t load the bundles.</p>
                <p className="mt-1 text-sm text-rose-700">{catalogError}</p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-rose-700 shadow-sm ring-1 ring-rose-200 transition hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                >
                  Try again
                </button>
              </div>
            ) : currentBundles.length > 0 ? (
              currentBundles.map((bundle) => (
                <button
                  key={bundle.id}
                  type="button"
                  onClick={() => handleBundleSelect(bundle.id)}
                  className={`relative flex min-h-[142px] w-full flex-col justify-between rounded-2xl border-2 p-3.5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 sm:min-h-[154px] sm:p-4 ${
                    selectedBundle === bundle.id
                      ? "border-sky-600 bg-sky-50 shadow-[0_8px_20px_rgba(14,165,233,0.10)]"
                      : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                  }`}
                  aria-pressed={selectedBundle === bundle.id}
                  aria-label={`Select ${bundle.size}, ${bundle.validity}, for ${bundle.price}`}
                >
                  {bundle.popular && (
                    <span className="absolute -top-2 left-3 rounded-full bg-emerald-500 px-2.5 py-1 text-[9px] font-bold tracking-[0.06em] text-white shadow-sm sm:text-[10px]">
                      POPULAR
                    </span>
                  )}

                  <div className="flex min-w-0 items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className={`whitespace-nowrap text-[26px] font-bold leading-none tracking-[-0.04em] transition-colors sm:text-3xl ${
                        selectedBundle === bundle.id ? "text-sky-700" : "text-slate-900"
                      }`}>
                        {bundle.size}
                      </div>
                      <div className="mt-2 text-xs leading-4 text-slate-500 sm:text-sm">
                        {bundle.validity.replace(" Validity", "")}
                      </div>
                    </div>

                    <span className="flex h-6 w-6 shrink-0 items-center justify-center" aria-hidden="true">
                      {selectedBundle === bundle.id ? (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-600">
                          <Check size={15} className="text-white" strokeWidth={3} />
                        </span>
                      ) : (
                        <span className="h-6 w-6 rounded-full border-2 border-slate-300" />
                      )}
                    </span>
                  </div>

                  <div className="mt-3 flex min-w-0 items-end justify-between gap-2 border-t border-slate-100 pt-3">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-slate-400 sm:text-[11px]">
                      Price
                    </span>
                    <span className={`whitespace-nowrap text-[15px] font-bold leading-none tracking-[-0.02em] transition-colors sm:text-lg ${
                      selectedBundle === bundle.id ? "text-sky-700" : "text-slate-900"
                    }`}>
                      {bundle.price}
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center">
                <p className="font-semibold text-slate-800">No bundles available</p>
                <p className="mt-1 text-sm text-slate-500">
                  There are currently no {selectedPlan.toLowerCase()} for {NETWORKS.find((network) => network.id === selectedNetwork)?.name}.
                  Try another category or network.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-12" aria-label="Purchase history">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-colors hover:border-slate-300">
            <Link
              href="/transactions"
              className="group flex min-h-[76px] w-full items-center gap-4 p-4 text-left transition-colors hover:bg-sky-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-500"
            >
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-slate-900">Purchase History</span>
                <span className="mt-1 block text-sm text-slate-500">Review your previous data purchases</span>
              </span>
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-slate-400 transition group-hover:bg-white group-hover:text-sky-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </span>
            </Link>
          </div>
        </section>
      </main>

      {checkoutDetails ? (
        <CheckoutPage
          modal
          details={checkoutDetails}
          onClose={() => {
            setCheckoutDetails(null);
            setSelectedBundle(null);
          }}
        />
      ) : null}
    </DashboardShell>
  );
}
