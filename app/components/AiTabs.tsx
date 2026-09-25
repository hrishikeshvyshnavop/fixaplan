"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { motion, MotionConfig, type Transition } from "motion/react";

export type AiTab = {
  title: string;
  description: string;
  image?: string;
  /** Different picture for phones and tablets (below 1280px); defaults to `image` */
  mobileImage?: string;
};

type AiTabsProps = {
  tabs: AiTab[];
};

// Per-tab image frame, from the original: aspect ratio + position on desktop, and on phone/tablet
const DESKTOP_FRAMES: CSSProperties[] = [
  { aspectRatio: "0.9833", right: 100, top: 60, bottom: 60 },
  { aspectRatio: "0.412", right: 120, top: 80, width: 418 },
  { aspectRatio: "0.7987", right: 110, top: 80, width: 605 },
];
// Phone/tablet frames sit inside the card's padding (40px top, 20px sides), like the original
const MOBILE_FRAMES: CSSProperties[] = [
  { aspectRatio: "0.4912", left: 50, right: 50, top: 40 },
  { aspectRatio: "0.412", left: 66, right: 67, top: 40 },
  { aspectRatio: "0.7987", left: -24, right: -25, top: 40 },
];

// Per-tab title width, from the original: first title never wraps, the others are fixed boxes
const TITLE_WIDTHS = ["w-auto whitespace-nowrap", "w-[200px]", "w-[237px]"];

const SPRING = "cubic-bezier(0.34, 1.25, 0.64, 1)"; // ~ Framer spring, bounce 0.15

// Accordion transitions, straight from the original's Framer component
const LAYOUT_SPRING: Transition = { type: "spring", bounce: 0.15, duration: 0.65 };
const TEXT_FADE: Transition = { delay: 0.2, duration: 0.35, ease: [0.44, 0, 0.56, 1] };

/** Chevron angle per tab, from the original: the first tab turns 360° ↔ 540°, the others 180° ↔ 360° */
function Chevron({ index, open }: { index: number; open: boolean }) {
  const rotate = open ? 360 : index === 0 ? 540 : 180;
  return (
    <motion.span
      layout
      aria-hidden="true"
      className={`flex h-[22px] w-8 flex-none items-center justify-center rounded-lg bg-white/5 ${open ? "" : "pt-[2px]"}`}
    >
      <motion.svg width="10" height="6" viewBox="0 0 10 6" fill="none" initial={false} animate={{ rotate }}>
        <path d="M1 5l4-4 4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>
    </motion.span>
  );
}

function Placeholder() {
  return <div className="h-full w-full rounded-3xl bg-white/10" />;
}

/** Click-to-switch tabs: accordion + big image on desktop (1280px+), swipe-style card with arrows below that. */
export default function AiTabs({ tabs }: AiTabsProps) {
  const [active, setActive] = useState(0);
  const count = tabs.length;
  const go = (i: number) => {
    const next = (i + count) % count;
    if (next === active) return;
    setActive(next);
  };
  const tab = tabs[active];

  const dots = (big: boolean) => (
    <div className={`flex items-center ${big ? "gap-2" : "w-[90px] justify-center gap-2"}`}>
      {tabs.map((t, i) => (
        <button
          key={t.title}
          type="button"
          aria-label={`Show ${t.title}`}
          aria-current={i === active || undefined}
          onClick={() => go(i)}
          className="cursor-pointer transition-all duration-[650ms]"
          style={{
            height: big ? 6 : 5,
            width: i === active ? (big ? 30 : 26) : big ? 6 : 5,
            borderRadius: big ? 49 : 6,
            background: i === active ? "#fff" : "rgba(255, 255, 255, 0.1)",
            transitionTimingFunction: SPRING,
          }}
        />
      ))}
    </div>
  );

  return (
    <>
      {/* Desktop: 1280px and up */}
      <div className="squircle relative hidden h-[700px] w-full max-w-[1320px] items-center overflow-hidden bg-[#1a1a1a] px-[100px] py-10 [--radius:24px] min-[1280px]:flex">
        {/* Every box animates its size/position with the same spring (Framer layout animation), like the original */}
        <MotionConfig transition={LAYOUT_SPRING}>
          <motion.div layout className="relative z-[4] flex w-[337px] flex-col items-start gap-2">
            {tabs.map((t, i) => {
              const open = i === active;
              return (
                // No backdrop blur (the original has 10px): over the smooth fixed gradient it changes nothing
                // visible, but it re-ran on every scroll frame
                <motion.button
                  layout
                  key={t.title}
                  type="button"
                  aria-expanded={open}
                  onClick={() => go(i)}
                  className={`squircle flex cursor-pointer flex-col items-start bg-white/5 px-6 py-5 text-left [--radius:12px] ${open ? "w-full" : "w-fit"} ${i === 0 ? "gap-4" : "gap-2.5"}`}
                >
                  <motion.span
                    layout
                    className={`flex gap-5 ${i === 2 ? "items-start" : "items-center"} ${open ? "w-full justify-between" : "w-fit"}`}
                  >
                    <motion.span
                      layout
                      className={`${TITLE_WIDTHS[i % TITLE_WIDTHS.length]} flex-none text-xl leading-[1.1] font-medium tracking-[-0.03em] text-white`}
                    >
                      {t.title}
                    </motion.span>
                    <Chevron index={i} open={open} />
                  </motion.span>
                  {/* Mounted only while open; fades in shortly after the box starts growing, gone at once on close */}
                  {open && (
                    <motion.span
                      layout
                      initial={{ opacity: 0.001 }}
                      animate={{ opacity: 1, transition: TEXT_FADE }}
                      className="block w-full leading-[1.3] font-medium text-white/60"
                    >
                      {t.description}
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        </MotionConfig>

        {/* Image slides in from the right each time the tab changes */}
        <div
          key={`d-${active}`}
          aria-hidden="true"
          className="ai-image-in absolute z-[1]"
          style={DESKTOP_FRAMES[active % DESKTOP_FRAMES.length]}
        >
          {tab.image ? <Image src={tab.image} alt="" fill sizes="650px" className="object-cover" /> : <Placeholder />}
        </div>

        <div className="absolute bottom-10 left-1/2 z-[5] flex h-[46px] -translate-x-1/2 items-center">{dots(true)}</div>
      </div>

      {/* Phone and tablet: below 1280px */}
      <div className="squircle relative flex h-[650px] w-full flex-col items-center overflow-hidden bg-[#1a1a1a] px-5 pt-10 pb-5 [--radius:24px] md:h-[1029px] min-[1280px]:hidden">
        <div
          key={`m-${active}`}
          aria-hidden="true"
          className="ai-image-in-mobile absolute z-[1]"
          style={MOBILE_FRAMES[active % MOBILE_FRAMES.length]}
        >
          {tab.mobileImage || tab.image ? (
            <Image src={(tab.mobileImage || tab.image)!} alt="" fill sizes="calc(100vw + 50px)" className="object-cover" />
          ) : (
            <Placeholder />
          )}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[245px] bg-[linear-gradient(180deg,rgba(26,26,26,0)_0%,rgba(26,26,26,0.66)_38%,rgba(26,26,26,0.9)_58%,#1a1a1a_100%)]" />

        <div className="relative z-[5] mt-auto flex w-full flex-col items-center gap-3">
          <p className="w-full px-6 py-5 leading-[1.3] font-medium text-white/60" aria-live="polite">
            <span className="text-white">{tab.title}. </span>
            {tab.description}
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => go(active - 1)}
              className="flex size-10 cursor-pointer items-center justify-center"
            >
              <svg width="16" height="9" viewBox="0 0 16 9" fill="none" className="-rotate-90" aria-hidden="true">
                <path d="M1 8l7-7 7 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {dots(false)}
            <button
              type="button"
              aria-label="Next"
              onClick={() => go(active + 1)}
              className="flex size-10 cursor-pointer items-center justify-center"
            >
              <svg width="16" height="9" viewBox="0 0 16 9" fill="none" className="rotate-90" aria-hidden="true">
                <path d="M1 8l7-7 7 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
