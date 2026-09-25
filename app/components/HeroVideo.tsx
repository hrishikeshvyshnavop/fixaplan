"use client";

import { useEffect, useState } from "react";

type HeroVideoProps = {
  src: string;
  className?: string;
};

/**
 * Background video iframe that only starts loading once the page itself has loaded. The Kinescope
 * player (and its own font) otherwise competes with the page's CSS, fonts and images; it can't be
 * seen until the intro panel clears at ~2.9s anyway.
 */
export default function HeroVideo({ src, className = "" }: HeroVideoProps) {
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
