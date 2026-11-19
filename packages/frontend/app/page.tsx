"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const networks = [
  { name: "MTN", logo: "/mtn.svg", color: "bg-yellow-100" },
  { name: "Telecel", logo: "/Telecel_Group.png", color: "bg-red-100" },
  { name: "AirtelTigo", logo: "/airtel.svg", color: "bg-blue-100" },
];

const tickerItems = ["MTN", "Telecel", "AirtelTigo", "No expiry", "Instant", "Mobile Money", "24/7"];
type Theme = "light" | "dark" | "system";

export default function LandingPage() {
  const [theme, setTheme] = useState<Theme>("system");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("xbundle-theme");
    if (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system") {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = () => {
      setIsDark(theme === "dark" || (theme === "system" && mediaQuery.matches));
    };

    updateTheme();
    mediaQuery.addEventListener("change", updateTheme);
    window.localStorage.setItem("xbundle-theme", theme);

    return () => mediaQuery.removeEventListener("change", updateTheme);
  }, [theme]);

  const cycleTheme = () => {
    setTheme((currentTheme) => {
      if (currentTheme === "system") return "light";
      if (currentTheme === "light") return "dark";
      return "system";
    });
  };

  return (
    <div className={isDark ? "dark" : ""}>
      <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
        <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
            <Link href="/" className="text-xl font-bold tracking-tight text-sky-700 dark:text-lime-400">xBundle</Link>
            <nav className="flex items-center gap-3" aria-label="Account navigation">
              <Link href="/login" className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">Log in</Link>
              <Link href="/signup" className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700">Create account</Link>
            </nav>
          </div>
        </header>

        <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-24">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700 dark:bg-slate-800 dark:text-lime-300">Fast, reliable data in Ghana</p>
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-6xl">Stay connected without the hassle.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">Browse affordable data bundles, pay securely, and send data to any number on MTN, Telecel, or AirtelTigo.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className="rounded-2xl bg-sky-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-sky-600/20 hover:bg-sky-700">Get started</Link>
              <Link href="/buy-data" className="rounded-2xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-700 hover:border-sky-300 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">Browse bundles</Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-3" aria-label="Supported networks">
              {networks.map((network) => (
                <div key={network.name} className={`flex items-center gap-2 rounded-xl ${network.color} px-3 py-2 text-sm font-semibold text-slate-700`}>
                  <img src={network.logo} alt="" className="h-6 w-6 object-contain" />{network.name}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] bg-gradient-to-br from-sky-600 to-emerald-500 p-1 shadow-2xl shadow-sky-900/10">
            <div className="rounded-[1.8rem] bg-white p-6 dark:bg-slate-900 sm:p-8">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Simple from start to finish</p>
              <div className="mt-6 space-y-5">
                {["Choose your network and bundle", "Enter the recipient's number", "Pay securely and track delivery"].map((step, index) => (
                  <div key={step} className="flex items-center gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 font-bold text-sky-700 dark:bg-slate-800 dark:text-lime-300">{index + 1}</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-100">{step}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">Your recipient number can be different from the phone number on your account.</div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden border-y border-slate-200 bg-white py-5 dark:border-slate-800 dark:bg-slate-900" aria-label="xBundle benefits">
          <div className="ticker-track flex w-max" aria-hidden="true">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center gap-8 px-4">
                {tickerItems.map((item) => (
                  <span key={`${copy}-${item}`} className="whitespace-nowrap text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    <span className="mr-8 text-sky-500 dark:text-lime-400">✦</span>{item}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <p className="sr-only">{tickerItems.join(", ")}</p>
        </section>

        <section id="about" className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 py-12 sm:grid-cols-3 sm:px-8">
            {[{ title: "Affordable bundles", text: "Find a plan that fits your budget." }, { title: "Secure payments", text: "Your payment is verified before processing." }, { title: "Track every order", text: "Keep your purchase history in one place." }].map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 p-5 dark:border-slate-700"><h2 className="font-bold text-slate-900 dark:text-white">{item.title}</h2><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.text}</p></div>
            ))}
          </div>
        </section>

        <footer className="border-t border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <Link href="/" className="text-lg font-bold tracking-tight text-sky-700 dark:text-lime-400">xBundle</Link>
              <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-slate-600 dark:text-slate-300" aria-label="Footer navigation">
                <Link href="/support" className="hover:text-sky-700 dark:hover:text-lime-400">Support</Link>
                <Link href="#about" className="hover:text-sky-700 dark:hover:text-lime-400">About</Link>
                <Link href="/privacy" className="hover:text-sky-700 dark:hover:text-lime-400">Privacy</Link>
                <Link href="/terms" className="hover:text-sky-700 dark:hover:text-lime-400">Terms and conditions</Link>
              </nav>
            </div>
            <div className="mt-8 flex flex-col gap-4 border-t border-slate-200 pt-5 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
              <p>© {new Date().getFullYear()} xBundle. All rights reserved.</p>
              <button
                type="button"
                onClick={cycleTheme}
                className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:border-sky-400 sm:self-auto dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                aria-label={`Color theme: ${theme}. Activate to change theme.`}
              >
                <span aria-hidden="true">{theme === "system" ? "◐" : theme === "dark" ? "☾" : "☀"}</span>
                Theme: {theme[0].toUpperCase() + theme.slice(1)}
              </button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
