"use client";

import { useEffect, useState } from "react";

type HeroVideoProps = {
  src: string;
  /** Player page (YouTube, Vimeo, Kinescope) in an iframe, or a video file */
  kind?: "iframe" | "file";
  className?: string;
};

/**
 * Background video that only starts loading once the page itself has loaded. The video player
 * (and its own fonts and scripts), or a large video file, otherwise competes with the page's CSS, fonts
 * and images; it can't be seen until the intro panel clears at ~2.9s anyway.
 */
export default function HeroVideo({ src, kind = "iframe", className = "" }: HeroVideoProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const start = () => setReady(true);
    if (document.readyState === "complete") {
      start();
      return;
    }
    window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);

  if (!ready) return null;
  if (kind === "file") {
    return <video src={src} autoPlay muted loop playsInline tabIndex={-1} className={className} />;
  }
  return (
    <iframe
      src={src}
      title="Hero background video"
      allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
      tabIndex={-1}
      className={className}
    />
  );
}
