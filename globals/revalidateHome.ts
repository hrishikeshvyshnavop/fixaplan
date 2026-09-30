import { revalidatePath } from "next/cache";
import type { GlobalAfterChangeHook } from "payload";

// The homepage is static; rebuild it on the next visit so edits show straight away.
// Shared `afterChange` hook for the page's globals. Draft autosaves (Live Preview) don't touch
// the public page, so only publishing refreshes it.
export const revalidateHome: GlobalAfterChangeHook = ({ doc }) => {
  if (doc?._status === "draft") return doc;
  try {
    revalidatePath("/");
  } catch {
    // Not inside a Next.js request (e.g. the Payload CLI); nothing to refresh
  }
  return doc;
};
