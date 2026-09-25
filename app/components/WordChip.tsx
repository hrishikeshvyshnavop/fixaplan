"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type WordChipProps = {
  text: string;
  /** Optional picture that pops up above the chip on hover */
  image?: string;
  /** Pop the picture up below the chip instead (the original does this for the second chip) */
  imageBelow?: boolean;
  /** Makes the chip a link (opens in a new tab, like the original) */
  href?: string;
  /** Seconds to wait before unfolding once it's on screen */
  delay?: number;
};

/**
 * Inline word in a white chip. It starts folded (1px wide) and unfolds once half of it
 * is on screen; hovering pops up an optional image above it.
 */
export default function WordChip({ text, image, imageBelow = false, href, delay = 0.5 }: WordChipProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState<number>();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && textRef.current) {
          setWidth(textRef.current.scrollWidth);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const chip = (
    <span
      ref={ref}
      className="group squircle relative inline-flex flex-none items-center bg-white/80 [--radius:8px]"
      style={{
        // Folded it's 47px tall; unfolded it hugs the text (4px padding), 41.6px like the original
        width: width ?? 1,
        height: width ? 41.6 : 47,
        transition: `width 0.8s cubic-bezier(0.63, 0, 0.4, 1) ${delay}s, height 0.8s cubic-bezier(0.63, 0, 0.4, 1) ${delay}s`,
      }}
    >
      <span className="flex h-full w-full items-center justify-center overflow-hidden">
        <span
          ref={textRef}
          className="px-2 text-[28px] leading-[1.2] font-medium tracking-[-0.02em] whitespace-nowrap text-black"
        >
          {text}
        </span>
      </span>

      {image && (
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute left-1/2 z-10 h-[158px] w-[230px] -translate-x-1/2 scale-50 rounded-[28px] bg-white/30 p-1 opacity-0 backdrop-blur-[10px] transition-[opacity,translate,scale] duration-700 ease-[cubic-bezier(0.34,1.4,0.64,1)] group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 ${
            // Above: rises out of the chip. Below: mirrored, drops out of it.
            imageBelow ? "top-[58px] -translate-y-[35px]" : "bottom-[58px] translate-y-[35px]"
          }`}
        >
          <Image src={image} alt="" width={222} height={150} className="h-full w-full rounded-3xl object-cover" />
        </span>
      )}
    </span>
  );

  if (!href) return chip;
  return (
    <a href={href} target="_blank" rel="noopener" className="inline-flex flex-none">
      {chip}
    </a>
  );
}
