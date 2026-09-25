"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import Button from "@/app/components/Button";

export type FooterLink = {
  label: string;
  href: string;
};

type FooterProps = {
  /** Huge line above the card, fading out towards the bottom */
  tagline?: string;
  logo?: string;
  updatesTitle?: string;
  updatesText?: string;
  ctaLabel?: string;
  ctaHref?: string;
  menu?: FooterLink[];
  email?: string;
  social?: FooterLink[];
  copyright?: string;
  privacyHref?: string;
  credit?: FooterLink;
};

/** Same as Framer's `offsetTop` walk: the element's position in the page, ignoring transforms */
function pageTop(el: HTMLElement) {
  let top = 0;
  for (let node: HTMLElement | null = el; node; node = node.offsetParent as HTMLElement | null) {
    top += node.offsetTop;
  }
  return top;
}

// Links fade to 40% on hover, like the original
const link = "transition-opacity duration-300 ease-[cubic-bezier(0.44,0,0.56,1)] hover:opacity-40";
const label = "w-20 leading-[0.95] font-normal tracking-[-0.02em] text-white/40";

function external(href: string) {
  return href.startsWith("http") || href.startsWith("mailto:") ? { target: "_blank", rel: "noopener" } : {};
}

function LinkGroup({ title, links, className = "" }: { title: string; links: FooterLink[]; className?: string }) {
  return (
    <div className={`flex flex-col items-start gap-4 max-md:gap-3 ${className}`}>
      <p className={label}>{title}</p>
      <ul className="flex flex-col items-start gap-2">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} {...external(l.href)} className={`block whitespace-pre ${link}`}>
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer({
  tagline = "A short closing line",
  logo = "Logo.",
  updatesTitle = "Stay in the loop",
  updatesText = "A sentence about what people will get.",
  ctaLabel = "Call to action",
  ctaHref = "#",
  menu = [{ label: "Home", href: "#" }],
  email = "hello@example.com",
  social = [],
  copyright = "© Company. All Rights Reserved.",
  privacyHref = "#",
  credit,
}: FooterProps) {
  const cardRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const [range, setRange] = useState([0, 1]);
  const [phone, setPhone] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    // From when the card's top reaches the bottom of the screen until its bottom does
    const measure = () => {
      const start = pageTop(card) - 1 - window.innerHeight;
      setRange([Math.max(start, 0), Math.max(start + card.clientHeight, 1)]);
    };
    const query = window.matchMedia("(max-width: 767.98px)");
    const updatePhone = () => setPhone(query.matches);
    measure();
    updatePhone();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener("resize", measure);
    query.addEventListener("change", updatePhone);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      query.removeEventListener("change", updatePhone);
    };
  }, []);

  // The card rises out from under the tagline and grows to full size; on phones it only rises, and less.
  // Smoothed with the original's spring so it trails the scroll slightly.
  const spring = { duration: 0.7, bounce: 0.2 };
  const y = useSpring(useTransform(scrollY, range, [phone ? -130 : -210, 0]), spring);
  const scale = useSpring(useTransform(scrollY, range, [phone ? 1 : 0.95, 1]), spring);

  return (
    <div className="flex w-full flex-col items-center px-3">
      <p
        aria-hidden="true"
        className="w-[808px] bg-[linear-gradient(0deg,rgba(26,26,26,0)_0%,rgba(26,26,26,0.6)_55.92%,rgba(26,26,26,0.8)_100%)] bg-clip-text text-center text-[120px] leading-[0.84] font-medium tracking-[-0.04em] text-transparent max-md:w-full max-md:text-[56px] max-md:leading-[0.94]"
      >
        {tagline}
      </p>

      <motion.footer
        ref={cardRef}
        style={{ y, scale }}
        className="squircle relative -mt-[15px] flex w-full flex-col items-center gap-[140px] bg-[#1a1a1a] p-10 font-medium text-white [--radius:24px] max-md:-mt-1 max-md:gap-[60px] max-md:p-6"
      >
        <div className="flex w-full items-start justify-between max-md:flex-col max-md:gap-[60px]">
          <div className="flex w-[39%] flex-col items-start gap-11 max-md:w-full">
            <p className="w-[364px] text-2xl leading-[0.84] font-normal tracking-[-0.04em] max-md:w-full">{logo}</p>
            <div className="flex w-full flex-col items-start gap-4">
              <div className="w-[364px] leading-[1.3] tracking-[-0.04em] max-md:w-full">
                <p>{updatesTitle}</p>
                <p className="text-white/60">{updatesText}</p>
              </div>
              <Button href={ctaHref}>{ctaLabel}</Button>
            </div>
          </div>

          <nav
            aria-label="Footer"
            className="flex w-[40%] items-start justify-between leading-[0.95] tracking-[-0.02em] max-md:w-full"
          >
            <div className="flex flex-col items-start gap-10 max-md:gap-6">
              <LinkGroup title="Information" links={menu} />
              <LinkGroup title="Contact" links={[{ label: email, href: `mailto:${email}` }]} />
            </div>
            {social.length > 0 && <LinkGroup title="Social" links={social} className="w-[72px]" />}
          </nav>
        </div>

        <div className="flex w-full items-center justify-between max-md:flex-col max-md:items-start max-md:gap-10">
          <p className="w-[364px] leading-[0.84] font-normal tracking-[-0.04em] text-white/40 max-md:order-1 max-md:w-full">
            {copyright}
          </p>
          <div className="flex w-[40%] items-center justify-between leading-[0.95] tracking-[-0.02em] max-md:order-0 max-md:w-full max-md:flex-col max-md:items-start max-md:gap-3">
            <a href={privacyHref} className={`whitespace-pre ${link}`}>
              Privacy Policy
            </a>
            {credit && (
              <p className="flex items-center gap-1 whitespace-pre">
                <span className="leading-[0.84] font-normal tracking-[-0.04em] text-white/40">Website by</span>
                <a href={credit.href} {...external(credit.href)} className={link}>
                  {credit.label}
                </a>
              </p>
            )}
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
