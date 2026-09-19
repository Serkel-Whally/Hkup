"use client"
import { ArrowRight } from "lucide-react";

export default function BundleCard({ bundle, onSelect }: any) {
  const validityLabel = bundle?.validity || "30 Days Validity";

  return (
    <article
      className="group min-w-[170px] md:min-w-[200px] flex-shrink-0 cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg"
      aria-labelledby={`bundle-${bundle.id}`}
      onClick={() => onSelect?.(bundle)}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs font-medium uppercase tracking-[0.08em] text-slate-400" id={`bundle-${bundle.id}`}>{bundle.network}</div>
        {bundle.popular && (
          <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-emerald-700">
            Popular
          </span>
        )}
      </div>

      <div className="mt-4 text-3xl font-black tracking-[-0.05em] text-slate-900">{bundle.size}</div>
      <div className="mt-1 text-sm text-slate-500">{validityLabel}</div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <div className="text-base font-bold text-slate-900">{bundle.price}</div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onSelect?.(bundle);
          }}
          aria-label={`Buy ${bundle.size} from ${bundle.network} for ${bundle.price}`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-50 text-sky-600 transition group-hover:bg-sky-600 group-hover:text-white"
        >
          <ArrowRight size={15} />
        </button>
      </div>
    </article>
  );
}
