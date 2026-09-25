"use server";

import { addSignup } from "@/app/waitlist/store";

export type WaitlistState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "joined"; email: string; name: string; position: number; existing: boolean };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function joinWaitlist(_prev: WaitlistState, formData: FormData): Promise<WaitlistState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  // Collapse runs of spaces; the field is optional
  const name = String(formData.get("name") ?? "").trim().replace(/\s+/g, " ").slice(0, 80);

  // Honeypot: people never see this field, bots fill it in. Pretend it worked.
  if (formData.get("company")) return { status: "joined", email, name, position: 0, existing: false };

  if (!email) return { status: "error", message: "Add your email so we can reach you." };
  if (email.length > 254 || !EMAIL.test(email)) {
    return { status: "error", message: "That email doesn’t look quite right — mind checking it?" };
  }

  try {
    const { position, existing } = await addSignup({ email, name: name || undefined });
    return { status: "joined", email, name, position, existing };
  } catch (err) {
    console.error("Waitlist signup failed", err);
    return { status: "error", message: "Something went wrong on our side. Please try again." };
  }
}
