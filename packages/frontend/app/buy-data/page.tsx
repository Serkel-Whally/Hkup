"use client"
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

const FALLBACK_BUNDLES = [
  { id: "mtn-1", network: "MTN", size: "1GB", validity: "7 Days", price: 4.5, popular: false },
  { id: "mtn-2", network: "MTN", size: "5GB", validity: "30 Days", price: 15.0, popular: true },
  { id: "mtn-3", network: "MTN", size: "10GB", validity: "30 Days", price: 28.0, popular: true },
  { id: "telecel-1", network: "Telecel", size: "3GB", validity: "14 Days", price: 10.0, popular: false },
  { id: "telecel-2", network: "Telecel", size: "8GB", validity: "30 Days", price: 22.5, popular: true },
  { id: "airtel-1", network: "AirtelTigo", size: "2GB", validity: "7 Days", price: 7.0, popular: false },
  { id: "airtel-2", network: "AirtelTigo", size: "12GB", validity: "30 Days", price: 32.0, popular: true },
];

type Bundle = { id: string; size: string; validity: string; price: string; popular: boolean };
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
    const grouped: BundleData = {};

    for (const bundle of FALLBACK_BUNDLES) {
      const networkId = NETWORKS.find((network) => network.name === bundle.network)?.id;
      if (!networkId) continue;
      const category = /night/i.test(bundle.validity)
        ? "Night Bundles"
        : /^(?:[3-9]\d|\d{3,})GB$/i.test(bundle.size)
          ? "Mega Bundles"
          : "Data Bundles";
      grouped[networkId] ??= {};
      grouped[networkId][category] ??= [];
      grouped[networkId][category].push({
        id: bundle.id,
        size: bundle.size,
        validity: bundle.validity,
        price: `GH₵ ${Number(bundle.price).toFixed(2)}`,
        popular: Boolean(bundle.popular),
      });
    }

    setBundleData(grouped);
    setCatalogLoading(false);
    setCatalogError("");
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
        <section>
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-6">Select Network</h2>
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:max-w-2xl md:grid-cols-3 md:gap-5 md:overflow-visible md:pb-0">
            {NETWORKS.map((network) => (
              <button
                key={network.id}
                onClick={() => {
                  setSelectedNetwork(network.id);
                  setSelectedBundle(null);
                }}
                className={`relative flex min-h-[124px] min-w-[148px] snap-start shrink-0 flex-col items-center justify-center rounded-2xl border-2 px-2 py-2.5 transition-all sm:min-h-[136px] sm:min-w-[160px] sm:px-4 md:min-w-0 md:min-h-[150px] md:py-4 ${
                  selectedNetwork === network.id
                    ? "border-sky-600 bg-sky-50/50 shadow-[0_8px_20px_rgba(14,165,233,0.12)]"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                }`}
                aria-pressed={selectedNetwork === network.id}
                aria-label={`Select ${network.name} network`}
              >
                {selectedNetwork === network.id && (
                    <div className="absolute right-2 top-2 rounded-full bg-sky-600 p-1">
                    <Check size={14} className="text-white" strokeWidth={3} />
                  </div>
                )}
                <div className="mb-2 flex h-11 w-12 items-center justify-center sm:h-14 sm:w-14 md:mb-3 md:h-16 md:w-16">
                  <Image
                    src={network.logo}
                    alt={network.name}
                    width={48}
                    height={48}
                    className="h-10 w-10 object-contain sm:h-12 sm:w-12 md:h-14 md:w-14"
                  />
                </div>
                <span className="whitespace-nowrap text-xs font-semibold text-slate-900 sm:text-sm md:text-base">{network.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-6">Choose a Plan</h2>
          <div className="flex gap-8 border-b border-slate-200 mb-8 overflow-x-auto">
            {PLAN_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedPlan(category);
                  setSelectedBundle(null);
                }}
                className={`pb-3 text-base font-medium whitespace-nowrap transition-colors ${
                  selectedPlan === category
                    ? "text-sky-600 border-b-2 border-sky-600"
                    : "text-slate-500 hover:text-slate-700"
                }`}
                aria-current={selectedPlan === category ? "true" : "false"}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {catalogLoading ? (
                <p className="py-10 text-center text-sm text-slate-500">Loading available bundles...</p>
              ) : catalogError ? (
                <p className="py-10 text-center text-sm text-rose-600" role="alert">{catalogError}</p>
              ) : currentBundles.length > 0 ? (
              currentBundles.map((bundle) => (
                <button
                  key={bundle.id}
                  onClick={() => handleBundleSelect(bundle.id)}
                  className={`relative flex min-h-[142px] w-full flex-col justify-between rounded-2xl border-2 p-3.5 text-left transition-all sm:min-h-[154px] sm:p-4 ${
                    selectedBundle === bundle.id
                      ? "border-sky-600 bg-sky-50/40 shadow-md"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                  }`}
                  aria-pressed={selectedBundle === bundle.id}
                  aria-label={`Select ${bundle.size} for ${bundle.price}`}
                >
                  <div className="flex min-w-0 items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div
                        className={`whitespace-nowrap text-[26px] font-bold leading-none tracking-[-0.04em] transition-colors sm:text-3xl ${
                          selectedBundle === bundle.id ? "text-sky-600" : "text-slate-900"
                        }`}
                      >
                        {bundle.size}
                      </div>
                      <div className="mt-2 text-xs leading-4 text-slate-500 sm:text-sm">{bundle.validity.replace(" Validity", "")}</div>
                    </div>

                    <div className="h-6 w-6 shrink-0">
                      {selectedBundle === bundle.id ? (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-600">
                          <Check size={15} className="text-white" strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="h-6 w-6 rounded-full border-2 border-slate-300" />
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex min-w-0 items-end justify-between gap-2 border-t border-slate-100 pt-3">
                    <span className="truncate text-[11px] font-medium uppercase tracking-[0.06em] text-slate-400">Price</span>
                    <span
                      className={`whitespace-nowrap text-[15px] font-bold leading-none tracking-[-0.02em] transition-colors sm:text-lg ${
                        selectedBundle === bundle.id ? "text-sky-600" : "text-slate-900"
                      }`}
                    >
                      {bundle.price}
                    </span>
                  </div>

                  {bundle.popular && (
                    <div className="absolute -top-2 left-3 rounded-full bg-emerald-500 px-2 py-1 text-[9px] font-bold tracking-[0.08em] text-white sm:text-[10px]">
                      POPULAR
                    </div>
                  )}
                </button>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                No data bundles available for this network.
              </div>
            )}
          </div>
        </section>

        <section className="mt-12">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <Link href="/transactions" className="group flex w-full items-start gap-4 p-4 text-left transition-colors hover:bg-sky-50/50">
              <div className="mt-1 flex-shrink-0 text-sky-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-slate-900">Purchase History</div>
                <div className="mt-1 text-sm text-slate-500">Review your previous data purchases</div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 text-slate-400">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
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
