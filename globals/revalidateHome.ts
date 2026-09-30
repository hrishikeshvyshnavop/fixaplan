import { revalidatePath } from "next/cache";

// The homepage is static; rebuild it on the next visit so edits show straight away.
// Shared `afterChange` hook for the page's globals.
export function revalidateHome() {
  try {
    revalidatePath("/");
  } catch {
    // Not inside a Next.js request (e.g. the Payload CLI); nothing to refresh
  }
}
