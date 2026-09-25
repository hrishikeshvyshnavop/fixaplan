"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, type Transition, type Variants } from "motion/react";
import Button from "@/app/components/Button";

type NextStepSectionProps = {
  /** Big gradient heading, top right */
  heading?: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** Two lines that rise in one after the other, bottom left */
  lines?: [string, string];
  /** Chips under the lines: first three on one row, the rest on the next */
  chips?: string[];
  image?: string;
  /** id of the section above; this one tucks 45px under it and slides up from under it (-450px → 0) while that one scrolls past */
  afterId?: string;
  id?: string;
};

// Timings from the original's Framer page
const HEADING: Transition = { duration: 0.7, ease: [0.5, 0, 0.44, 1] };
const LINE: Transition = { duration: 0.8, ease: [0.12, 0.23, 0.5, 1] };
const CHIP: Transition = { duration: 0.7, ease: [0.52, 0, 0.46, 1] };

/** Lines rise out of a clipped box (tilted 3°, pivoting on the left) once half the content is on screen */
const lineVariants: Variants = {
  hidden: { y: 35, rotate: 3 },
  shown: (delay: number) => ({ y: 0, rotate: 0, transition: { ...LINE, delay } }),
};

/** Same as Framer's `offsetTop` walk: the element's position in the page, ignoring transforms */
function pageTop(el: HTMLElement) {
  let top = 0;
  for (let node: HTMLElement | null = el; node; node = node.offsetParent as HTMLElement | null) {
    top += node.offsetTop;
  }
  return top;
}

function Chip({ text, delay }: { text: string; delay: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 7, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ ...CHIP, delay }}
      className="squircle flex h-[42px] flex-none items-center bg-black/20 px-3 py-1 text-sm leading-[0.95] font-medium whitespace-nowrap text-white [--radius:8px]"
    >
      {text}
    </motion.span>
  );
}

export default function NextStepSection({
  heading = "A short, bold heading.",
  ctaLabel = "Call to action",
  ctaHref = "#",
  lines = ["First line,", "second line"],
  chips = ["Chip one", "Chip two", "Chip three", "Chip four", "Chip five"],
  image,
  afterId,
  id,
}: NextStepSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  // Scroll ranges (px) for the slide-up and the background zoom, measured like the original
  const [ranges, setRanges] = useState({ slide: [0, 1], zoom: [0, 1] });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const measure = () => {
      const vh = window.innerHeight;
      const above = afterId ? document.getElementById(afterId) : null;
      // Slide: while the section above passes the middle of the screen
      const slideStart = above ? pageTop(above) - 1 - vh / 2 : 0;
      const slideEnd = above ? slideStart + above.clientHeight : 1;
      // Zoom: from when this section's top reaches the bottom of the screen until its bottom does
      const zoomStart = pageTop(section) - 1 - vh;
      const zoomEnd = zoomStart + section.clientHeight;
      setRanges({
        slide: [Math.max(slideStart, 0), Math.max(slideEnd, 1)],
        zoom: [Math.max(zoomStart, 0), Math.max(zoomEnd, 1)],
      });
    };
    measure();
    // Re-measure when anything above changes size (images loading, fonts, breakpoints)
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [afterId]);

  const y = useTransform(scrollY, ranges.slide, afterId ? [-450, 0] : [0, 0]);
  const scale = useTransform(scrollY, ranges.zoom, [1, 1.2]);

  // Phones: the heading starts as soon as it peeks in, 0.15s later (like the original's phone layout)
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 767.98px)");
    const update = () => setPhone(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const rows = [chips.slice(0, 3), chips.slice(3)];

  return (
    <motion.section
      ref={sectionRef}
      id={id}
      style={{ y }}
      className="relative z-[1] -mt-[45px] flex h-[106vh] w-full items-center justify-center overflow-clip"
    >
      {/* Background slowly zooms in as the section scrolls through */}
      <motion.div
        aria-hidden="true"
        style={{ scale }}
        className="absolute inset-x-[-53px] inset-y-[-15px] z-[1] max-md:inset-x-auto max-md:inset-y-0 max-md:right-[-89px] max-md:left-[-9px]"
      >
        {image ? (
          // Overhangs the screen and zooms to 120% while scrolling
          <Image src={image} alt="" fill sizes="calc(120vw + 130px)" className="object-cover" />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_center,#6b6b6b,#1f1f1f)]" />
        )}
      </motion.div>

      <div className="relative z-[1] flex h-[106vh] w-px flex-1 flex-col items-center overflow-clip px-[60px] py-[120px] max-md:px-5">
        <motion.div
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, amount: 0.5 }}
          className="flex h-px w-full max-w-[1320px] flex-1 flex-col items-center justify-between overflow-clip"
        >
          {/* Top right: heading + button */}
          <div className="flex w-full flex-col items-end gap-10 overflow-clip max-md:gap-6">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: phone ? 0 : 0.5 }}
              transition={{ ...HEADING, delay: phone ? 0.15 : 0 }}
              className="w-[487px] bg-[linear-gradient(203deg,#fff_33%,rgba(255,255,255,0.4)_84%)] bg-clip-text text-right text-[66px] leading-none font-medium text-transparent max-md:w-full max-md:text-[50px]"
            >
              {heading}
            </motion.h2>
            <Button href={ctaHref}>{ctaLabel}</Button>
          </div>

          {/* Bottom left: two rising lines + chips */}
          <div className="flex w-full flex-col items-start gap-10 overflow-clip max-md:gap-6">
            <p className="flex h-[77px] w-full flex-col items-start overflow-clip text-[32px] leading-[1.1] font-medium text-white max-md:leading-[1.05]">
              <span className="block h-[38px] w-full overflow-clip">
                <motion.span variants={lineVariants} custom={0.1} className="block w-[487px] origin-left max-md:w-full">
                  {lines[0]}
                </motion.span>
              </span>
              <motion.span variants={lineVariants} custom={0.25} className="block w-[487px] origin-left max-md:w-full">
                {lines[1]}
              </motion.span>
            </p>

            <div className="flex w-[1320px] flex-col items-start gap-2.5 max-md:w-full">
              {rows.map((row, r) => (
                <div key={r} className="flex items-center gap-2.5">
                  {row.map((chip, i) => (
                    <Chip key={chip} text={chip} delay={0.1 * (r * 3 + i + 1)} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
