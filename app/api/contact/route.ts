import { NextResponse } from "next/server";
import { profile } from "@/lib/data";

export const runtime = "nodejs";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/**
 * Sends the message to your inbox through Resend (https://resend.com).
 * Set RESEND_API_KEY (and optionally CONTACT_TO / CONTACT_FROM) in your environment.
 * Without a key this returns 501 and the form falls back to the visitor's mail app.
 */
export async function POST(req: Request) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ error: "not_configured" }, { status: 501 });

  let data: { name?: string; email?: string; message?: string; website?: string };
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }
  if (data.website) return NextResponse.json({ ok: true }); // honeypot: pretend success

  const name = (data.name ?? "").toString().trim().slice(0, 120);
  const email = (data.email ?? "").toString().trim().slice(0, 160);
  const message = (data.message ?? "").toString().trim().slice(0, 4000);
  if (!name || !message || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO || profile.email],
      reply_to: email,
      subject: `Portfolio message from ${name}`,
      html: `<p><strong>${esc(name)}</strong> &lt;${esc(email)}&gt;</p><p>${esc(message).replace(/\n/g, "<br>")}</p>`,
      text: `${name} <${email}>\n\n${message}`,
    }),
  });
  if (!res.ok) return NextResponse.json({ error: "send_failed" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
