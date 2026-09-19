"use client";

import Link from "next/link";
import { ArrowLeft, Headset, Send, UserRound } from "lucide-react";
import { FormEvent, useState } from "react";
import { DashboardShell } from "@/app/components/dashboard-shell";

type ChatMessage = { id: number; author: "support" | "you"; text: string; time: string };

const quickReplies = ["My bundle has not arrived", "I need help with payment", "How do I fund my wallet?"];

export default function LiveChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, author: "support", text: "Hi Kyrios, welcome to CelluLite support. How can we help today?", time: "Now" },
  ]);

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = message.trim();
    if (!text) return;
    setMessages((current) => [...current, { id: Date.now(), author: "you", text, time: "Now" }]);
    setMessage("");
  }

  function addQuickReply(text: string) {
    setMessages((current) => [...current, { id: Date.now(), author: "you", text, time: "Now" }]);
  }

  return (
    <DashboardShell active="/support">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="flex items-start gap-3">
          <Link href="/support" aria-label="Back to Support Centre" className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100"><ArrowLeft size={21} /></Link>
          <div>
            <p className="text-sm font-medium text-sky-600">Support Centre</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">Live chat</h1>
            <p className="mt-2 text-sm text-slate-500">Chat with our support team about your account or purchase.</p>
          </div>
        </header>

        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <div className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-sky-700 via-cyan-600 to-emerald-500 px-5 py-4 text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15"><Headset size={20} /></span>
            <div className="min-w-0 flex-1"><h2 className="text-sm font-semibold">CelluLite Support</h2><p className="mt-0.5 text-xs text-cyan-50">Typically replies in a few minutes</p></div>
            <span className="flex items-center gap-1.5 text-xs font-medium"><span className="h-2 w-2 rounded-full bg-emerald-200" /> Online</span>
          </div>

          <div className="min-h-[360px] space-y-4 bg-slate-50/70 p-4 sm:p-6" aria-live="polite">
            {messages.map((chatMessage) => (
              <div key={chatMessage.id} className={`flex items-end gap-2 ${chatMessage.author === "you" ? "justify-end" : ""}`}>
                {chatMessage.author === "support" && <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600"><Headset size={16} /></span>}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-5 ${chatMessage.author === "you" ? "rounded-br-md bg-sky-600 text-white" : "rounded-bl-md border border-slate-200 bg-white text-slate-700"}`}>
                  <p>{chatMessage.text}</p><p className={`mt-1 text-[11px] ${chatMessage.author === "you" ? "text-sky-100" : "text-slate-400"}`}>{chatMessage.time}</p>
                </div>
                {chatMessage.author === "you" && <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600"><UserRound size={16} /></span>}
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {quickReplies.map((reply) => <button key={reply} type="button" onClick={() => addQuickReply(reply)} className="rounded-full border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-medium text-sky-700 transition hover:bg-sky-100">{reply}</button>)}
            </div>
            <form onSubmit={sendMessage} className="flex items-center gap-2">
              <label htmlFor="chat-message" className="sr-only">Message support</label>
              <input id="chat-message" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Write a message..." className="h-12 min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100" />
              <button type="submit" aria-label="Send message" className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-sky-600 text-white transition hover:bg-sky-500"><Send size={18} /></button>
            </form>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
