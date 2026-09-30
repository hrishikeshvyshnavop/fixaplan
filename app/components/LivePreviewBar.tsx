"use client";

import { RefreshRouteOnSave } from "@payloadcms/live-preview-react";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";

const noSubscribe = () => () => {};

// Rendered only in draft mode. Inside the admin's Live Preview frame it re-renders the page
// each time Payload autosaves. Opened in a normal tab, it says drafts are showing and offers a way out.
export default function LivePreviewBar() {
  const router = useRouter();
  // Both are browser-only; on the server nothing renders
  const origin = useSyncExternalStore(noSubscribe, () => window.location.origin, () => null);
  const inFrame = useSyncExternalStore(noSubscribe, () => window.self !== window.top, () => true);
  if (!origin) return null;

  return (
    <>
      <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={origin} />
      {!inFrame && (
        <form
          action="/preview/exit"
          method="post"
          className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-[12px] bg-[#1a1a1a] py-2 pr-2 pl-4 text-sm font-medium text-white"
        >
          Showing drafts
          <button type="submit" className="rounded-[8px] bg-white px-3 py-1.5 text-black">
            Exit preview
          </button>
        </form>
      )}
    </>
  );
}
