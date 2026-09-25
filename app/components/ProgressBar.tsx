"use client";

import { useEffect, useRef } from "react";

type ProgressBarProps = {
  label: string;
  /** Starting and ending value shown in the counter (percent); counts over `duration` seconds */
  from: number;
  to: number;
  /** Starting and ending width of the filled part (percent of the bar) */
  widthFrom: number;
  widthTo: number;
  /** Ending width below 810px, where the original uses different values (defaults to `widthTo`) */
  widthToPhone?: number;
  active: boolean;
  duration?: number;
  delay?: number;
};

// Width: Framer spring (bounce 0.2, 2s) sampled into a CSS linear() curve; overshoots about 1.5% then settles
const WIDTH_SPRING =
  "linear(0, 0.0208, 0.0739, 0.1478, 0.2337, 0.3245, 0.4153, 0.5025, 0.5838, 0.6577, 0.7235, 0.7808, 0.8301, 0.8716, 0.906, 0.9341, 0.9566, 0.9742, 0.9876, 0.9977, 1.0049, 1.0098, 1.0128, 1.0145, 1.0151, 1.015, 1.0143, 1.0132, 1.012, 1.0106, 1.0092, 1.0079, 1.0066, 1.0055, 1.0044, 1.0035, 1.0028, 1.0021, 1.0015, 1.0011, 1)";

// Counter: cubic-bezier(0.44, 0, 0.56, 1), close enough
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

export default function ProgressBar({
  label,
  from,
  to,
  widthFrom,
  widthTo,
  widthToPhone = widthTo,
  active,
  duration = 1,
  delay = 0,
}: ProgressBarProps) {
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const counter = counterRef.current;
    if (!active || !counter) return;
    let frame = 0;
    let start: number | undefined;
    let shown = from;
    // Writes the number straight into the DOM instead of re-rendering React every frame
    const tick = (now: number) => {
      start ??= now + delay * 1000;
      const t = Math.min(Math.max((now - start) / (duration * 1000), 0), 1);
      const value = Math.round(from + (to - from) * easeInOut(t));
      if (value !== shown) {
        shown = value;
        counter.textContent = `${value}%`;
      }
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, from, to, duration, delay]);

  return (
    <div className="squircle relative z-[3] flex h-[50px] w-[490px] max-w-full items-center justify-between overflow-clip bg-black/25 pr-4 backdrop-blur-[20px] [--radius:12px]">
      <div
        className="squircle flex h-full w-(--w) items-center gap-3 overflow-clip bg-white/25 py-4 pr-2 pl-4 [--radius:12px] md:w-(--w-md)"
        style={{
          // Phone and desktop end widths differ; the md: breakpoint picks between them in CSS
          ["--w" as string]: `${active ? widthToPhone : widthFrom}%`,
          ["--w-md" as string]: `${active ? widthTo : widthFrom}%`,
          transition: `width 2s ${WIDTH_SPRING} ${delay}s`,
        }}
      >
        <p className="min-w-0 flex-1 overflow-hidden leading-[1.2] font-medium whitespace-nowrap text-white">{label}</p>
        <div className="h-full w-0.5 flex-none rounded-[20px] bg-white" />
      </div>
      <span
        ref={counterRef}
        className="text-base leading-[1.2] font-medium tracking-[-0.08em] whitespace-nowrap text-white tabular-nums"
      >
        {from}%
      </span>
    </div>
  );
}
