import type { ReactNode } from "react";
import Button from "@/app/components/Button";
import HeroVideo from "@/app/components/HeroVideo";

const VIDEO_ID = "wXQXtViozUbKjC61PdWpw2";
const VIDEO_SRC = `https://kinescope.io/embed/${VIDEO_ID}?autoplay=1&muted=1&loop=1&playsinline=1&controls=0&preload=auto`;

type HeroSectionProps = {
  /** First headline line */
  titleTop?: ReactNode;
  /** Second headline line, text before the accent word */
  titleBottom?: ReactNode;
  /** Italic serif accent word at the end of the second line */
  titleAccent?: ReactNode;
  description?: ReactNode;
  /** Text shown inside the glass CTA bar, next to the button */
  ctaNote?: ReactNode;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
};

export default function HeroSection({
  titleTop = "Your headline",
  titleBottom = "goes right",
  titleAccent = "here",
  description = "A short supporting sentence that explains what you offer in one line",
  ctaNote = "A brief note that sits next to the button.",
  ctaLabel = "Get started",
  ctaHref = "#",
  className = "",
}: HeroSectionProps) {
  return (
    <section
      className={`relative isolate z-[2] flex h-screen w-full flex-col items-center justify-end overflow-hidden bg-black px-4 pb-[100px] md:h-[106vh] md:px-0 ${className}`}
    >
      {/* Background video — like the original, sized at 120% of a 3:2 frame (180vh × 80vw), never smaller than the section */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <HeroVideo
          src={VIDEO_SRC}
          className="absolute top-1/2 left-1/2 h-[80vw] min-h-full w-[180vh] min-w-full -translate-x-1/2 -translate-y-1/2 border-0"
        />
      </div>

      {/* Bottom shade so the text stays readable */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[570px] bg-linear-to-b from-transparent to-black/60 md:h-[321px] md:to-black/40"
      />

      <div className="flex w-full flex-col items-center gap-[60px] md:gap-[100px]">
        <div className="flex w-full flex-col items-center gap-6 md:gap-10">
          <h1 className="flex w-full flex-col items-center text-center text-[49px] leading-[0.95] font-normal tracking-[-0.03em] text-white md:text-[96px]">
            <span className="flex h-[65px] w-full items-center justify-center overflow-clip md:h-[120px]">
              <span className="hero-line block [--rise:130px] [animation-delay:2.4s]">{titleTop}</span>
            </span>
            {/* -13px pulls the second line up, same as the original */}
            <span className="-mt-[13px] flex w-full justify-center overflow-clip">
              <span className="hero-line block [--rise:100px] [animation-delay:2.6s]">
                {titleBottom} <em className="font-serif italic">{titleAccent}</em>
              </span>
            </span>
          </h1>

          <p className="hero-fade w-[282px] text-center text-base leading-[1.2] font-medium tracking-[-0.02em] text-white/80 [animation-delay:2.8s] md:w-[278px]">
            {description}
          </p>
        </div>

        {/* Phone: frosted note box with the button below it. Desktop: one frosted bar with the button inside. */}
        <div className="hero-fade flex w-[264px] flex-col items-center gap-2 [animation-delay:3.3s] md:h-[50px] md:w-auto md:flex-row md:gap-6 md:rounded-xl md:bg-black/25 md:py-1 md:pr-1 md:pl-4 md:backdrop-blur-[10px]">
          <p className="w-full rounded-xl bg-black/25 px-[18px] py-4 text-base leading-[0.95] font-medium tracking-[-0.02em] text-white backdrop-blur-[10px] md:w-auto md:rounded-none md:bg-transparent md:p-0 md:whitespace-nowrap md:backdrop-blur-none">
            {ctaNote}
          </p>
          <Button href={ctaHref} className="md:h-full">
            {ctaLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
