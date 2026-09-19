"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, LockKeyhole, Mail, ShieldCheck, UserRound } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { addStoredNotification } from "@/app/lib/notifications";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");

    if (!name || !email || password.length < 8) {
      setError("Please provide a name, a valid email, and a password with at least 8 characters.");
      setLoading(false);
      return;
    }

    const registerResponse = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const registerPayload = await registerResponse.json().catch(() => ({}));

    if (!registerResponse.ok) {
      setError(registerPayload?.error || "Unable to create your account.");
      setLoading(false);
      return;
    }

    const signInResponse = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (signInResponse?.error) {
      setError(signInResponse.error || "Unable to sign in after creating your account.");
      setLoading(false);
      return;
    }

    addStoredNotification({
      title: "Welcome to CelluLite",
      message: "Congratulations! Your account was created successfully.",
      kind: "system",
      tone: "green",
      dedupeKey: `account-created:${registerPayload?.user?.id ?? email}`,
    });

    toast.success("Account created", { description: "Your account is ready." });
    router.push("/dashboard");
    router.refresh();
    setLoading(false);
  }

  return <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-8 text-slate-900"><div className="pointer-events-none absolute -left-24 top-[-8rem] h-80 w-80 rounded-full bg-sky-200/50 blur-3xl" /><div className="pointer-events-none absolute -bottom-24 -right-16 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" /><div className="pointer-events-none absolute inset-0 bg-white/30 backdrop-blur-2xl" /><section className="relative w-full max-w-md rounded-3xl border border-white/80 bg-white/90 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-9"><Link href="/" className="inline-flex items-center gap-3" aria-label="CelluLite Data home"><Image src="/cellulite_logo_icon.svg" alt="CelluLite Data" width={44} height={44} /><span><strong className="block text-lg">CelluLite Data</strong><small className="block text-[10px] font-bold uppercase tracking-[0.16em] text-sky-600">Create account</small></span></Link><div className="mt-9"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-600 text-white"><UserRound size={22} /></span><h1 className="mt-5 text-3xl font-bold tracking-[-0.04em]">Get started</h1><p className="mt-2 text-sm leading-6 text-slate-500">Create an account to manage bundles, wallet activity, and announcements.</p></div><form onSubmit={submit} className="mt-7 space-y-4"><Field name="name" label="Full name" icon={<UserRound size={17} />} placeholder="Your full name" /><Field name="email" label="Email address" icon={<Mail size={17} />} type="email" placeholder="you@example.com" /><Field name="password" label="Password" icon={<LockKeyhole size={17} />} type="password" placeholder="At least 8 characters" minLength={8} />{error ? <p className="text-sm font-medium text-red-600" role="alert">{error}</p> : null}<button type="submit" disabled={loading} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-sky-600 text-sm font-bold text-white hover:bg-sky-500 disabled:opacity-60">{loading ? "Creating account..." : "Create account"}<ArrowRight size={17} /></button></form><div className="mt-6 flex items-start gap-2 rounded-xl bg-emerald-50 p-3 text-xs leading-5 text-emerald-800"><ShieldCheck size={16} className="mt-0.5 shrink-0" /> Your password is protected with secure hashing.</div><p className="mt-6 text-center text-sm text-slate-500">Already have an account? <Link href="/login" className="font-semibold text-sky-600 hover:text-sky-700">Sign in</Link></p></section></main>;
}

function Field({ name, label, icon, type = "text", placeholder, minLength }: { name: string; label: string; icon: React.ReactNode; type?: string; placeholder: string; minLength?: number }) {
  return <label className="block text-sm font-semibold text-slate-700">{label}<span className="relative mt-2 block"><span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span><input name={name} type={type} required minLength={minLength} placeholder={placeholder} autoComplete={name === "password" ? "new-password" : name} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 font-normal outline-none focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100" /></span></label>;
}