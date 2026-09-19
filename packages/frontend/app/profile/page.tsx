"use client";

import Link from "next/link";
import { Bell, ChevronRight, LockKeyhole, Mail, Phone, Settings, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { DashboardShell } from "@/app/components/dashboard-shell";

const preferences = [
  { label: "Notifications", description: "Manage alerts for purchases and wallet activity", icon: Bell, href: "/notifications" },
  { label: "Security", description: "Update your password and account protection", icon: LockKeyhole, href: "/security" },
  { label: "Settings", description: "Manage your CelluLite Data preferences", icon: Settings, href: "/settings" },
];

export default function ProfilePage() {
  const { data: session } = useSession();
  const [name, setName] = useState("Customer");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [error, setError] = useState("");
  const [avatarError, setAvatarError] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setDraftName(name);
  }, [name]);

  useEffect(() => {
    const loadProfile = () => {
      if (!session?.user) {
        setError("You are not signed in.");
        setLoading(false);
        return;
      }

      setName((session.user as any).full_name || session.user.name || session.user.email || "Customer");
      setEmail(session.user.email || "");
      setPhone((session.user as any).phone || "");
      setAvatarUrl((session.user as any).avatar_url || "");
      setError("");
      setLoading(false);
    };

    loadProfile();
  }, [session]);

  async function handleSaveName() {
    const trimmedName = draftName.trim();

    if (!trimmedName) {
      setError("Name cannot be empty.");
      return;
    }

    setName(trimmedName);
    setIsEditingName(false);
    setError("");
  }

  async function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploading(true);
    setAvatarError("");

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setAvatarUrl(dataUrl);
      setUploading(false);
      event.target.value = "";
    };

    reader.onerror = () => {
      setAvatarError("Unable to read the selected image.");
      setUploading(false);
    };

    reader.readAsDataURL(file);
  }

  async function handleRemoveAvatar() {
    setUploading(true);
    setAvatarError("");

    setAvatarUrl("");
    setUploading(false);
  }

  return (
    <DashboardShell active="/profile">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <header>
          <p className="text-sm font-medium text-sky-600">Account</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">Profile</h1>
          <p className="mt-2 text-sm text-slate-500">Manage your personal details and account preferences.</p>
        </header>

        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)] md:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-sky-100 to-cyan-50 text-sky-600 ring-8 ring-sky-50">
              {avatarUrl ? (
                <img src={avatarUrl} alt={`${name} avatar`} className="h-full w-full object-cover" />
              ) : (
                <UserRound size={36} strokeWidth={1.8} />
              )}
            </div>
            <div className="min-w-0 flex-1">
              {isEditingName ? (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <input
                    value={draftName}
                    onChange={(event) => setDraftName(event.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-base text-slate-900 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 sm:max-w-xs"
                    aria-label="Edit full name"
                  />
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={handleSaveName} className="rounded-lg bg-sky-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-700">Save</button>
                    <button type="button" onClick={() => { setIsEditingName(false); setDraftName(name); setError(""); }} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-xl font-semibold text-slate-900">{loading ? "Loading..." : name || "Your profile"}</p>
                  <button type="button" onClick={() => setIsEditingName(true)} className="text-sm font-semibold text-sky-600 transition hover:text-sky-700">Edit name</button>
                </div>
              )}
              <p className="mt-1 text-sm text-slate-500">Premium account</p>
              <span className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Account active</span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-300"
            >
              {uploading ? "Uploading..." : avatarUrl ? "Change photo" : "Add photo"}
            </button>

            {avatarUrl && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Remove photo
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          {avatarError && <p className="mt-4 text-sm font-medium text-rose-600" role="alert">{avatarError}</p>}
          {error && <p className="mt-4 text-sm font-medium text-rose-600" role="alert">{error}</p>}
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)] md:p-6" aria-labelledby="contact-details-title">
          <div className="border-b border-slate-100 pb-4">
            <h2 id="contact-details-title" className="text-lg font-semibold text-slate-900">Contact details</h2>
            <p className="mt-1 text-xs text-slate-500">Your account contact information</p>
          </div>
          <div className="grid gap-4 pt-5 sm:grid-cols-2">
            <Detail icon={<Mail size={18} />} label="Email address" value={email} />
            <Detail icon={<Phone size={18} />} label="Phone number" value={phone} />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)] md:p-6" aria-labelledby="preferences-title">
          <div className="border-b border-slate-100 pb-4">
            <h2 id="preferences-title" className="text-lg font-semibold text-slate-900">Account preferences</h2>
            <p className="mt-1 text-xs text-slate-500">Control how your account works</p>
          </div>
          <div className="divide-y divide-slate-100">
            {preferences.map(({ label, description, icon: Icon, href }) => (
              <Link key={label} href={href} className="flex min-h-16 w-full items-center gap-3 py-4 text-left transition hover:bg-slate-50">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-600"><Icon size={18} /></span>
                <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-slate-900">{label}</span><span className="mt-1 block text-xs text-slate-500">{description}</span></span>
                <ChevronRight size={18} className="flex-shrink-0 text-slate-400" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sky-600 shadow-sm">{icon}</span>
      <span className="min-w-0"><span className="block text-xs text-slate-500">{label}</span><span className="mt-1 block truncate text-sm font-semibold text-slate-900">{value}</span></span>
    </div>
  );
}
