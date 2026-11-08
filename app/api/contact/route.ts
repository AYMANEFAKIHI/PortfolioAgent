import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

/**
 * Sends the contact form to your Gmail with nodemailer.
 * Needs GMAIL_USER and GMAIL_PASS (a Google "App password", not your normal password)
 * in .env.local (and in your hosting provider's environment variables).
 * Without them this returns 501 and the form falls back to the visitor's mail app.
 */
export async function POST(req: Request) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_PASS;
  if (!user || !pass) return NextResponse.json({ error: "not_configured" }, { status: 501 });

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

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  const mailOptions = {
    from: user,
    replyTo: email,
    to: process.env.CONTACT_TO || user,
    subject: `New message from ${name} via portfolio contact form`,
    text: `You have received a new message from your portfolio contact form:\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] sendMail failed:", err);
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
}
