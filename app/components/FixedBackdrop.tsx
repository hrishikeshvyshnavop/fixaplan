"use client";

import { useEffect, useState } from "react";

type FixedBackdropProps = {
  /** Main background picture (covers the screen) */
  image?: string;
  /** Second picture layered on top of the first */
  overlayImage?: string;
  /** id of the element that clears the grey cover once it's fully on screen */
  revealId: string;
};

/**
 * Fixed full-screen layer behind the page (like the original "back-fixed"): blurred pictures (or a gradient)
 * and a grey cover. The cover fades out when `revealId` is fully visible, and back in when you
 * scroll back above it.
 */
export default function FixedBackdrop({ image, overlayImage, revealId }: FixedBackdropProps) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const target = document.getElementById(revealId);
    if (!target) return;
    // Clear once the trigger's bottom is on screen (fully visible, or already scrolled past it);
    // grey again only once it's back below the screen (scrolled back up)
    const update = (rect: DOMRect) => {
      if (rect.bottom <= window.innerHeight + 1) setRevealed(true);
      else if (rect.top > window.innerHeight) setRevealed(false);
    };
    const observer = new IntersectionObserver(([entry]) => update(entry.boundingClientRect), {
      threshold: [0, 0.99],
    });
    observer.observe(target);
    // A jump past the trigger (anchor link, reload mid-page) never crosses a threshold, so check after scrolls too
    const onScrollEnd = () => update(target.getBoundingClientRect());
    window.addEventListener("scrollend", onScrollEnd, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scrollend", onScrollEnd);
    };
  }, [revealId]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[1] overflow-clip">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element -- decorative full-screen background
        <img src={image} alt="" className="absolute inset-0 h-full w-full scale-110 object-cover blur-[20px]" />
      ) : (
        // Colours sampled from the original's blurred background: warm amber glow on the left fading into dark olive
        <div
          className="absolute inset-0"
          style={{
            background: [
              "radial-gradient(ellipse 45% 40% at 15% 58%, #796132 0%, rgba(121, 97, 50, 0) 100%)",
              "radial-gradient(ellipse 40% 30% at 45% 10%, #65512f 0%, rgba(101, 81, 47, 0) 100%)",
              "radial-gradient(ellipse 55% 45% at 20% 25%, #594a2b 0%, rgba(89, 74, 43, 0) 100%)",
              "linear-gradient(100deg, #534629 0%, #3b3825 40%, #282d21 70%, #272b20 100%)",
            ].join(", "),
          }}
        />
      )}
      {overlayImage && (
        // eslint-disable-next-line @next/next/no-img-element -- decorative full-screen background
        <img src={overlayImage} alt="" className="absolute inset-0 h-full w-full scale-110 object-cover blur-[20px]" />
      )}
      {/* The original blurs everything behind this layer by 20px. A full-screen backdrop-filter is re-run on
          every scroll frame and was the main cause of scroll jank, so the pictures are blurred once instead
          (scaled 110% to hide the soft edges). The default gradient is already smooth: blurring it changed 0 pixels. */}
      <div className="absolute inset-0 bg-black/10" />
      <div
        className="absolute inset-0 bg-[#eaeaea] transition-opacity duration-400 ease-[cubic-bezier(0.34,1.2,0.64,1)]"
        style={{ opacity: revealed ? 0 : 1 }}
      />
    </div>
  );
}
