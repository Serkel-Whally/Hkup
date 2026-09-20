"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { register } from "@/app/lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const update = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => setForm((current) => ({ ...current, [key]: event.target.value }));
  async function handleSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setError(""); if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; } setLoading(true); try { await register({ name: form.name, phone: form.phone, email: form.email, password: form.password }); router.push("/dashboard"); } catch (err) { setError(err instanceof Error ? err.message : "Unable to create your account."); setLoading(false); } }
  return <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-12"><div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><Link href="/" className="text-lg font-bold text-sky-700">CelluLite<span className="text-emerald-600"> Data</span></Link><h1 className="mt-8 text-3xl font-bold text-slate-950">Create your account</h1><p className="mt-2 text-slate-600">Start buying affordable data in a few steps.</p><form onSubmit={handleSubmit} className="mt-7 space-y-4">{([ ["name", "Full name", "text"], ["phone", "Phone number", "tel"], ["email", "Email", "email"], ["password", "Password", "password"], ["confirmPassword", "Confirm password", "password"] ] as const).map(([key, label, type]) => <label key={key} className="block text-sm font-semibold text-slate-700">{label}<input required type={type} value={form[key]} onChange={update(key)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100" /></label>)}{error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}<button disabled={loading} className="w-full rounded-xl bg-sky-600 px-4 py-3.5 font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Creating account…" : "Create account"}</button></form><p className="mt-6 text-center text-sm text-slate-600">Already have an account? <Link href="/login" className="font-semibold text-sky-700 hover:underline">Log in</Link></p></div></main>;
}
