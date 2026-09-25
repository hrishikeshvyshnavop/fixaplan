"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useTransform, type Transition, type Variants } from "motion/react";
import WordChip from "@/app/components/WordChip";

export type FaqItem = {
  question: string;
  answer: string;
};

type FaqSectionProps = {
  label?: string;
  /** Intro sentence; it continues on the next line with the email chip + `introEnd` */
  intro?: string;
  introEnd?: string;
  /** Word shown in the unfolding chip, and where it links */
  chipText?: string;
  chipHref?: string;
  chipImage?: string;
  items?: FaqItem[];
  /** id of the section above; the panel tucks 45px over it and slides up (-120px → 0) while that one scrolls past */
  afterId?: string;
  /** Anything that sits on the same light panel below the FAQ */
  children?: ReactNode;
};

// Timings from the original's Framer page
const TEXT_IN: Transition = { duration: 0.6, ease: [0.57, 0, 0.44, 1] };
const ITEM_IN: Transition = { duration: 0.8, ease: [0.12, 0.23, 0.5, 1] };
const EASE: Transition["ease"] = [0.65, 0, 0.35, 1];
const OPEN: Transition = { duration: 0.65, ease: EASE };
const CLOSE: Transition = { duration: 0.5, ease: EASE };
/** Closed height before the question row is measured: 24px padding + 22px icon row + 24px padding */
const CLOSED_HEIGHT = 70;

/** Questions rise in one after another once half the FAQ block is on screen */
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  shown: (i: number) => ({ opacity: 1, y: 0, transition: { ...ITEM_IN, delay: 0.15 + 0.1 * i } }),
};

/** Same as Framer's `offsetTop` walk: the element's position in the page, ignoring transforms */
function pageTop(el: HTMLElement) {
  let top = 0;
  for (let node: HTMLElement | null = el; node; node = node.offsetParent as HTMLElement | null) {
    top += node.offsetTop;
  }
  return top;
}

function usePhone() {
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 767.98px)");
    const update = () => setPhone(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return phone;
}

function Question({ item, index, phone, defaultOpen }: { item: FaqItem; index: number; phone: boolean; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  // Closed, only the question row shows; measured so a question that wraps (phones) isn't cut off
  const headRef = useRef<HTMLButtonElement>(null);
  const [closedHeight, setClosedHeight] = useState(CLOSED_HEIGHT);
  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setClosedHeight(el.offsetHeight));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const transition = open ? OPEN : CLOSE;
  // Like the original: desktop turns 0° ↔ 180° and fades the answer; phone turns 360° ↔ 180° and only clips it
  const rotate = open ? 180 : phone ? 360 : 0;
  const answerId = `faq-answer-${index}`;

  return (
    <motion.div
      custom={index}
      variants={itemVariants}
      className="squircle w-full overflow-hidden bg-black/5 [--radius:24px]"
    >
      <motion.div initial={false} animate={{ height: open ? "auto" : closedHeight }} transition={transition}>
        <button
          ref={headRef}
          type="button"
          aria-expanded={open}
          aria-controls={answerId}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full cursor-pointer items-start gap-6 px-7 py-6 text-left max-md:items-center"
        >
          <span className="flex-1 text-lg leading-[1.2] font-medium tracking-[-0.02em] text-black">
            {item.question}
          </span>
          <span aria-hidden="true" className="flex h-[22px] w-8 flex-none items-center justify-center rounded-xl bg-black/10">
            <motion.img
              src="/hCBxi6SokjtaDwCAVhx1F2tXA.svg"
              alt=""
              width={14}
              height={14}
              initial={false}
              animate={{ rotate }}
              transition={transition}
            />
          </span>
        </button>
        <motion.p
          id={answerId}
          initial={false}
          animate={{ opacity: open || phone ? 1 : 0 }}
          transition={transition}
          className="px-7 pb-6 leading-[1.3] font-medium text-black/60"
        >
          {item.answer}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

export default function FaqSection({
  label = "FAQ",
  intro = "An intro sentence that ends with a way to reach you, feel free to",
  introEnd = "anytime.",
  chipText = "email us",
  chipHref,
  chipImage,
  items = [
    { question: "First question?", answer: "Answer to the first question." },
    { question: "Second question?", answer: "Answer to the second question." },
  ],
  afterId,
  children,
}: FaqSectionProps) {
  const phone = usePhone();
  const { scrollY } = useScroll();
  const [range, setRange] = useState([0, 1]);

  useEffect(() => {
    const above = afterId ? document.getElementById(afterId) : null;
    if (!above) return;
    // Slide while the section above passes the middle of the screen
    const measure = () => {
      const start = pageTop(above) - 1 - window.innerHeight / 2;
      setRange([Math.max(start, 0), Math.max(start + above.clientHeight, 1)]);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [afterId]);

  const y = useTransform(scrollY, range, afterId ? [-120, 0] : [0, 0]);
  const reveal = { opacity: 0, y: 35 };

  return (
    <motion.div
      style={{ y }}
      className="relative z-[4] -mt-[45px] flex w-full flex-col items-center gap-[160px] overflow-clip rounded-t-[40px] bg-[#eaeaea] pt-[160px] pb-3 max-md:gap-[120px] max-md:rounded-t-3xl max-md:pt-[100px]"
    >
      <motion.section
        id="faq"
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.5 }}
        className="flex w-full flex-col items-center gap-[60px] max-md:px-5"
      >
        <div className="flex w-full max-w-[670px] items-start gap-[60px] max-md:flex-col max-md:gap-6">
          <div className="flex h-9 flex-none items-center rounded-lg bg-black/5 px-3">
            <p className="text-sm leading-[0.95] font-medium text-[rgb(134,134,134)]">{label}</p>
          </div>

          <div className="flex w-px flex-1 flex-col items-start text-[32px] leading-[1.2] font-medium tracking-[-0.02em] text-black/50 max-md:w-full max-md:flex-none">
            <motion.p
              initial={reveal}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...TEXT_IN, delay: 0.15 }}
              className="w-[559px] max-md:w-full"
            >
              {intro}
            </motion.p>
            <motion.div
              initial={reveal}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...TEXT_IN, delay: 0.25 }}
              className="flex w-full items-center gap-2"
            >
              <WordChip text={chipText} href={chipHref} image={chipImage} delay={0.3} />
              <span className="whitespace-pre">{introEnd}</span>
            </motion.div>
          </div>
        </div>

        <div className="flex w-full max-w-[670px] flex-col items-center gap-3">
          {items.map((item, i) => (
            <Question key={item.question} item={item} index={i} phone={phone} defaultOpen={i === 0} />
          ))}
        </div>
      </motion.section>

      {children}
    </motion.div>
  );
}
