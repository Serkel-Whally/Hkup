"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { login } from "@/app/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setLoading(true);
    try { await login({ email, password }); router.push("/dashboard"); }
    catch (err) { setError(err instanceof Error ? err.message : "Unable to log in."); setLoading(false); }
  }

  return <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-12"><div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><Link href="/" className="text-lg font-bold text-sky-700">CelluLite<span className="text-emerald-600"> Data</span></Link><h1 className="mt-10 text-3xl font-bold text-slate-950">Welcome back</h1><p className="mt-2 text-slate-600">Log in to manage your data purchases.</p><form onSubmit={handleSubmit} className="mt-8 space-y-5"><label className="block text-sm font-semibold text-slate-700">Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100" /></label><label className="block text-sm font-semibold text-slate-700">Password<input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100" /></label>{error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}<button disabled={loading} className="w-full rounded-xl bg-sky-600 px-4 py-3.5 font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Logging in…" : "Log in"}</button></form><p className="mt-6 text-center text-sm text-slate-600">New to CelluLite? <Link href="/signup" className="font-semibold text-sky-700 hover:underline">Create an account</Link></p></div></main>;
}
