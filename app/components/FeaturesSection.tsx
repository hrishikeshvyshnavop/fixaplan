import Image from "next/image";
import Button from "@/app/components/Button";
import FeatureList from "@/app/components/FeatureList";
import Reveal from "@/app/components/Reveal";

export type Feature = {
  title: string;
  description: string;
  icon?: string;
  image?: string;
};

type FeaturesSectionProps = {
  heading?: string;
  /** Short note above the button, one string per line */
  note?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  features?: Feature[];
};

export default function FeaturesSection({
  heading = "Your features heading goes here",
  note = ["A short line above the button.", "A second short line."],
  ctaLabel = "Get started",
  ctaHref = "#",
  features = [
    { title: "Feature one", description: "A sentence or two describing the first feature." },
    { title: "Feature two", description: "A sentence or two describing the second feature." },
    { title: "Feature three", description: "A sentence or two describing the third feature." },
    { title: "Feature four", description: "A sentence or two describing the fourth feature." },
  ],
}: FeaturesSectionProps) {
  return (
    // No background: the fixed backdrop shows through. Pulled up 45px under the section above.
    <section
      id="features"
      className="relative z-[2] -mt-[45px] flex w-full flex-col items-center overflow-clip px-5 py-[120px] md:px-6 md:pt-[160px] md:pb-[120px] min-[1280px]:px-[60px]"
    >
      <div className="flex w-full max-w-[1320px] flex-col gap-10 md:gap-[100px] min-[1280px]:flex-row min-[1280px]:items-start min-[1280px]:gap-[150px] min-[1440px]:gap-[300px]">
        {/* Left: sticks while the cards scroll past (not on phones) */}
        <div className="relative z-[1] flex w-full flex-col justify-center gap-10 md:sticky md:top-[100px] md:justify-start min-[1280px]:h-[80vh] min-[1280px]:w-min min-[1280px]:justify-between min-[1280px]:gap-0">
          <div className="flex w-full flex-col items-start gap-10 min-[1280px]:w-min">
            <Reveal threshold={0.5} className="[--rd:0.6s] [--ry:20px] md:[--ry:30px]">
              <h2 className="w-full text-[46px] leading-[0.95] font-normal tracking-[-0.03em] text-white min-[1280px]:w-[464px]">
                {heading}
              </h2>
            </Reveal>

            <div className="hidden min-[1280px]:block">
              <FeatureList titles={features.map((f) => f.title)} cardSelector="[data-feature-card]" />
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-3 min-[1280px]:w-min">
            <div className="w-full leading-[1.2] font-medium tracking-[-0.02em] text-white min-[1280px]:w-[299px]">
              {note.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <Button href={ctaHref}>{ctaLabel}</Button>
          </div>
        </div>

        {/* Right: the cards */}
        <div className="flex w-full flex-col items-start gap-3 md:gap-10 min-[1280px]:w-auto min-[1280px]:flex-1">
          {features.map((feature) => (
            <Reveal
              key={feature.title}
              threshold={0.5}
              repeat
              className="w-full [--rd:0.65s] [--rx:15px] [--ry:0px]"
            >
              {/* Border drawn as an inset ring: like Framer's, it takes no space (a real border squeezed titles onto two lines) */}
              <article
                data-feature-card
                className="squircle flex w-full flex-col items-center gap-10 bg-black/20 p-6 inset-ring inset-ring-white/10 [--radius:24px] md:p-10"
              >
                <div className="flex w-full flex-col items-start gap-5">
                  {feature.icon ? (
                    // eslint-disable-next-line @next/next/no-img-element -- small SVG icon
                    <img src={feature.icon} alt="" width={40} height={40} className="size-10 rounded-sm object-cover" />
                  ) : (
                    <div className="size-10 rounded-sm bg-white/15" />
                  )}
                  <h3 className="w-full text-2xl leading-[1.2] font-medium tracking-[-0.02em] text-white">
                    {feature.title}
                  </h3>
                </div>

                <div className="relative aspect-[1.09677] w-[300px] max-w-full overflow-clip">
                  {feature.image ? (
                    <Image src={feature.image} alt="" fill sizes="300px" className="object-cover" />
                  ) : (
                    <div className="h-full w-full rounded-2xl bg-white/10" />
                  )}
                </div>

                <p className="w-full leading-[1.2] font-medium tracking-[-0.02em] text-white/60">{feature.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
