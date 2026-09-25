"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type ParallaxImageProps = {
  src?: string;
  className?: string;
  /** 100 = moves with the page, lower = lags behind (the original uses 90) */
  speed?: number;
};

/** Absolutely positioned image, vertically centred on its `top`, that drifts down by (100 - speed)% of the page scroll. */
export default function ParallaxImage({ src, className = "", speed = 90 }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      // Same as Framer: offset grows with how far the page has scrolled from the top
      const shift = window.scrollY * (1 - speed / 100);
      el.style.transform = `translate3d(0, calc(-50% + ${shift.toFixed(1)}px), 0)`;
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    // Only listen to scroll while the image's card is on screen
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        update();
        window.addEventListener("scroll", onScroll, { passive: true });
      } else {
        window.removeEventListener("scroll", onScroll);
      }
    });
    observer.observe(el.parentElement ?? el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [speed]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`absolute will-change-transform ${className}`}
      style={{ transform: "translate3d(0, -50%, 0)" }}
    >
      {src ? (
        // Wider than the screen below 1280px (it overhangs the card on both sides)
        <Image src={src} alt="" fill sizes="(min-width: 1280px) 100vw, calc(100vw + 550px)" className="object-cover" />
      ) : (
        <div className="h-full w-full bg-[radial-gradient(ellipse_at_center,#9ca3af,#4b5563)]" />
      )}
    </div>
  );
}
