"use client";

import { useState } from "react";
import { Send } from "lucide-react";

type Labels = {
  formTitle: string; fName: string; fEmail: string; fMsg: string; fSend: string; fSending: string;
  fSent: string; fMailto: string; fError: string; fInvalid: string;
};
type Status = "idle" | "sending" | "sent" | "mailto" | "error" | "invalid";

export default function ContactForm({ labels, to }: { labels: Labels; to: string }) {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();
    const website = String(fd.get("website") ?? ""); // honeypot
    if (!name || !message || !/^\S+@\S+\.\S+$/.test(email)) return setStatus("invalid");
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, website }),
      });
      if (res.ok) {
        form.reset();
        return setStatus("sent");
      }
      if (res.status === 501) {
        // No mail service configured on the server: fall back to the visitor's mail app.
        const body = `${message}\n\n— ${name} (${email})`;
        window.location.href = `mailto:${to}?subject=${encodeURIComponent(`Portfolio — ${name}`)}&body=${encodeURIComponent(body)}`;
        return setStatus("mailto");
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  const field =
    "w-full rounded-xl border border-zinc-800 bg-[#0b0b0d] px-4 py-3 text-[0.95rem] text-zinc-100 placeholder:text-zinc-600 transition-colors hover:border-zinc-600 focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50";
  const sending = status === "sending";
  const msg = { sent: labels.fSent, mailto: labels.fMailto, error: labels.fError, invalid: labels.fInvalid } as Record<string, string>;

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
      <h3 className="font-display text-3xl uppercase leading-none text-white">{labels.formTitle}</h3>
      <label className="sr-only" htmlFor="cf-name">{labels.fName}</label>
      <input id="cf-name" name="name" autoComplete="name" placeholder={labels.fName} maxLength={120} disabled={sending} className={field} />
      <label className="sr-only" htmlFor="cf-email">{labels.fEmail}</label>
      <input id="cf-email" name="email" type="email" autoComplete="email" placeholder={labels.fEmail} maxLength={160} disabled={sending} className={field} />
      <label className="sr-only" htmlFor="cf-msg">{labels.fMsg}</label>
      <textarea id="cf-msg" name="message" rows={5} placeholder={labels.fMsg} maxLength={4000} disabled={sending} className={`${field} resize-y`} />
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <div className="mt-1 flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-primary" disabled={sending}>
          <Send size={16} aria-hidden /> {sending ? labels.fSending : labels.fSend}
        </button>
        <p role="status" aria-live="polite" className={`text-sm ${status === "error" || status === "invalid" ? "text-accent" : "text-zinc-400"}`}>
          {msg[status] ?? ""}
        </p>
      </div>
    </form>
  );
}
