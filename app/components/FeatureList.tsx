"use client";

import { useEffect, useState } from "react";

type FeatureListProps = {
  titles: string[];
  /** Selector for the cards this list follows, in the same order as `titles` */
  cardSelector: string;
};

/** Chips that highlight whichever card is half on screen (the last one wins when several are). */
export default function FeatureList({ titles, cardSelector }: FeatureListProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>(cardSelector));
    if (cards.length === 0) return;
    const visible = new Set<number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = cards.indexOf(entry.target as HTMLElement);
          if (entry.intersectionRatio >= 0.5) visible.add(index);
          else visible.delete(index);
        }
        if (visible.size > 0) setActive(Math.max(...visible));
        // Scrolled back above every card: go back to the first one
        else if (cards[0].getBoundingClientRect().top > 0) setActive(0);
      },
      { threshold: [0, 0.5] },
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [cardSelector]);

  return (
    <ul className="flex flex-col items-start gap-2">
      {titles.map((title, i) => {
        const isActive = i === active;
        return (
          <li
            key={title}
            aria-current={isActive || undefined}
            className="squircle flex items-center bg-black/20 px-3 py-1 leading-[0.95] font-medium tracking-[-0.02em] whitespace-nowrap transition-all duration-[650ms] ease-[cubic-bezier(0.44,0,0.56,1)] [--radius:8px]"
            style={{
              height: isActive ? 42 : 36,
              fontSize: isActive ? 18 : 16,
              color: isActive ? "rgb(255, 255, 255)" : "rgba(255, 255, 255, 0.4)",
            }}
          >
            {title}
          </li>
        );
      })}
    </ul>
  );
}
