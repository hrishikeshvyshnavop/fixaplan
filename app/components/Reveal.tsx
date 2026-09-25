"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Start the animation this many px before the element's top reaches the bottom of the screen (negative = later) */
  offset?: number;
  /** Fraction of the element that must be visible (0–1) */
  threshold?: number;
  /** Replay every time it re-enters the screen instead of only once */
  repeat?: boolean;
  /** Watch the parent instead: needed when the content starts pushed fully outside a clipping parent,
      where it never counts as on screen (e.g. the ADHD heading on phones) */
  observeParent?: boolean;
};

/**
 * Animates its content in once it scrolls into view.
 * The starting state and timing come from CSS variables so they can change per breakpoint:
 *   --rx / --ry (translate), --rr (rotate), --ro (start opacity),
 *   --rd (duration), --rdelay (delay), --re (easing), --origin (transform origin)
 */
export default function Reveal({
  children,
  className = "",
  style,
  offset = 0,
  threshold = 0,
  repeat = false,
  observeParent = false,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = observeParent ? ref.current?.parentElement : ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = threshold > 0 ? entry.intersectionRatio >= threshold : entry.isIntersecting;
        if (visible) {
          setInView(true);
          if (!repeat) observer.disconnect();
        } else if (repeat) {
          setInView(false);
        }
      },
      { rootMargin: `0px 0px ${-offset}px 0px`, threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [offset, threshold, repeat, observeParent]);

  return (
    <div ref={ref} data-inview={inView || undefined} className={`reveal ${className}`} style={style}>
      {children}
    </div>
  );
}
