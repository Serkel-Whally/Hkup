"use client";

import { Toaster } from "sonner";

export function GlobalToaster() {
  return (
    <Toaster
      position="top-right"
      expand={false}
      closeButton
      richColors
      offset={16}
      toastOptions={{
        duration: 4000,
        classNames: {
          toast: "border border-slate-200 bg-white text-slate-800 shadow-lg",
          title: "font-semibold text-slate-900",
          description: "text-slate-600",
          actionButton: "bg-sky-600 text-white",
          cancelButton: "bg-slate-100 text-slate-700",
        },
      }}
    />
  );
}
