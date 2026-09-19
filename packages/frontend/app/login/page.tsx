"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, Zap } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { SubmitButton } from "../components/SubmitButton";

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");

    if (!email || !password) {
      setError("Please enter your email and password.");
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error || "Unable to sign in.");
      setLoading(false);
      return;
    }

    toast.success("Welcome back!", { description: "Redirecting you to your dashboard." });
    const next = new URLSearchParams(window.location.search).get("next");
    router.push(next?.startsWith("/") ? next : "/dashboard");
    router.refresh();
    setLoading(false);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(125,211,252,0.24),transparent_35%),linear-gradient(135deg,#f8fcff_0%,#eef9fb_100%)]" />
      <div className="relative mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-12">
        <section className="hidden min-h-[560px] flex-col justify-between rounded-[28px] bg-gradient-to-br from-sky-700 via-cyan-600 to-emerald-500 p-8 text-white shadow-[0_24px_60px_rgba(14,116,144,0.2)] lg:flex xl:p-10">
          <div>
            <Link href="/" className="inline-flex items-center rounded-lg bg-white/10 p-2 backdrop-blur-sm" aria-label="CelluLite Data home">
              <Image src="/logo.png" alt="CelluLite Data" width={180} height={60} className="h-auto w-[180px]" priority />
            </Link>
            <div className="mt-20 max-w-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-100">Your data, simplified</p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight">Everything you need to stay connected.</h1>
              <p className="mt-5 text-base leading-7 text-cyan-50">Buy affordable bundles across Ghana&apos;s major networks with a faster, clearer way to manage your data.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Feature icon={<Zap size={18} />} label="Fast purchases" />
            <Feature icon={<ShieldCheck size={18} />} label="Secure account" />
          </div>
        </section>

        <section className="mx-auto w-full max-w-md rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-9">
          <div className="mb-8 lg:hidden">
            <Link href="/" className="inline-flex" aria-label="CelluLite Data home">
              <Image src="/logo.png" alt="CelluLite Data" width={180} height={60} className="h-auto w-[160px]" priority />
            </Link>
          </div>
          <div>
            <p className="text-sm font-medium text-sky-600">Welcome back</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Sign in to CelluLite</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">Access your wallet, bundles, and account activity.</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
              <div className="relative">
                <Mail size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-100" />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                <button type="button" className="text-xs font-semibold text-sky-600 hover:text-sky-700">Forgot password?</button>
              </div>
              <div className="relative">
                <LockKeyhole size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required placeholder="Enter your password" className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-100" />
                <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error ? <p className="text-sm font-medium text-red-600" role="alert">{error}</p> : null}
            <SubmitButton text={loading ? "Signing in..." : "Sign in"} />
          </form>

          <p className="mt-7 text-center text-sm text-slate-500">New to CelluLite? <Link href="/signup" className="font-semibold text-sky-600 hover:text-sky-700">Get started</Link></p>
        </section>
      </div>
    </main>
  );
}

function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-3 text-sm font-medium text-white"><span className="text-cyan-100">{icon}</span>{label}</div>;
}
