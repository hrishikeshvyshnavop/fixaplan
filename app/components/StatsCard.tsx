"use client";

import { useEffect, useRef, useState } from "react";
import ParallaxImage from "@/app/components/ParallaxImage";
import ProgressBar from "@/app/components/ProgressBar";

export type Stat = {
  label: string;
  from: number;
  to: number;
  widthFrom: number;
  widthTo: number;
  widthToPhone?: number;
};

type StatsCardProps = {
  image?: string;
  stats: Stat[];
};

/** 577px card with a parallax image and progress bars that animate once the card is in view. */
export default function StatsCard({ image, stats }: StatsCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const root = entry.rootBounds;
        // Like the original: half the card visible, 100px further into the screen.
        // On very short screens half the card can't fit, so filling the visible area also counts.
        const fillsScreen = root !== null && entry.intersectionRect.height >= root.height - 1;
        if (entry.intersectionRatio >= 0.5 || (entry.isIntersecting && fillsScreen)) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: "0px 0px -100px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="squircle relative flex h-[577px] w-full flex-col items-center justify-end gap-2 overflow-hidden px-4 pb-4 [--radius:24px] md:gap-4 md:px-0 md:pb-[50px]"
    >
      {/* Height follows the width at the original 1.339:1 ratio */}
      <ParallaxImage
        src={image}
        className="top-[42%] -right-[277px] -left-[276px] z-[1] aspect-[1.33929] md:top-[37%] md:-right-[95px] md:-left-[94px] min-[1280px]:top-1/4 min-[1280px]:right-0 min-[1280px]:left-0"
      />
      {stats.map((stat) => (
        <ProgressBar key={stat.label} {...stat} active={active} />
      ))}
    </div>
  );
}
