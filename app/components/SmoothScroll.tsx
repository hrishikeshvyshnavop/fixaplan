"use client";

import Lenis from "lenis";
import { useEffect } from "react";

// Anchor links glide like the original's: a brief pause, then a critically damped spring.
// Measured on the original from the click: starts ~0.1–0.15s, 50% ~0.3s, 90% ~0.5–0.6s, done ~0.95s.
const ANCHOR_PAUSE = 0.07; // seconds before the page starts moving
const ANCHOR_SPRING = 8.4; // spring rate (1/s)
const ANCHOR_DURATION = ANCHOR_PAUSE + 8 / ANCHOR_SPRING; // until the spring is ~99.7% there
const spring = (s: number) => 1 - (1 + s) * Math.exp(-s);
const anchorEase = (t: number) => {
  const s = Math.max(0, t * ANCHOR_DURATION - ANCHOR_PAUSE) * ANCHOR_SPRING;
  return t >= 1 ? 1 : spring(s) / spring(8);
};

/**
 * Smooth wheel scrolling with Lenis, set up like the original site: default easing for the wheel,
 * smooth anchor links, native scrolling on touch devices. Off for reduced motion.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      smoothWheel: true,
      autoRaf: true,
      autoToggle: true,
      anchors: { duration: ANCHOR_DURATION, easing: anchorEase },
      allowNestedScroll: true,
    });

    return () => lenis.destroy();
  }, []);

  return null;
}
