import type { CSSProperties } from "react";
import Reveal from "@/app/components/Reveal";
import StatsCard, { type Stat } from "@/app/components/StatsCard";
import WordChip from "@/app/components/WordChip";

export type Point = {
  title: string;
  description: string;
  icon?: string;
};

type AdhdSectionProps = {
  label?: string;
  /** Statement — first sentence is dark, second is muted */
  statement?: string;
  statementMuted?: string;
  /** "{before} [chip] {after}" on one line, then "[chip 2]" on the next */
  compareBefore?: string;
  compareChip?: string;
  compareChipImage?: string;
  compareAfter?: string;
  compareChip2?: string;
  compareChip2Image?: string;
  image?: string;
  stats?: [Stat, Stat];
  kicker?: string;
  heading?: string;
  points?: Point[];
};

// Per-card entrance delays (phone / desktop), same as the original
const POINT_DELAYS = [
  ["0.2s", "0.15s"],
  ["0.35s", "0.25s"],
  ["0.5s", "0.35s"],
];

export default function AdhdSection({
  label = "Section label",
  statement = "A short statement that introduces this section.",
  statementMuted = "A second supporting sentence in a softer colour.",
  compareBefore = "More",
  compareChip = "word one",
  compareChipImage,
  compareAfter = "— more",
  compareChip2 = "word two",
  compareChip2Image,
  image,
  stats = [
    { label: "Metric one", from: 80, to: 21, widthFrom: 83, widthTo: 25 },
    { label: "Metric two", from: 21, to: 80, widthFrom: 30, widthTo: 83 },
  ],
  kicker = "A short lead-in line for the heading below",
  heading = "Your big heading here",
  points = [
    { title: "Point one", description: "One line explaining the first point." },
    { title: "Point two", description: "One line explaining the second point." },
    { title: "Point three", description: "One line explaining the third point." },
  ],
}: AdhdSectionProps) {
  return (
    // Pulled up 45px so its rounded top overlaps the bottom of the hero. Phones: 100px padding, 120px gap (original)
    <section className="relative z-[2] -mt-[45px] flex w-full flex-col items-center gap-[120px] overflow-clip rounded-3xl bg-[#eaeaea] py-[100px] md:gap-[160px] md:rounded-[40px] md:py-[160px]">
      {/* Part 1: label, statement, comparison, stats card */}
      <div className="relative z-[2] flex w-full flex-col items-center gap-10 px-5 md:gap-[60px] md:px-3">
        <div className="flex w-full flex-col items-start gap-6 md:w-auto md:flex-row md:gap-[60px]">
          <Reveal className="[--rd:0.6s] [--ry:0px]">
            <div className="squircle flex h-9 items-center bg-black/5 px-3 [--radius:8px]">
              <p className="text-sm leading-[0.95] font-medium text-[rgb(134,134,134)]">{label}</p>
            </div>
          </Reveal>

          <div className="flex w-full flex-col md:w-auto">
            <Reveal className="[--rd:0.6s] [--re:cubic-bezier(0.57,0,0.44,1)] [--ry:15px] md:[--ry:35px]">
              <div className="w-full text-[28px] leading-[1.2] font-medium tracking-[-0.02em] text-black md:w-[475px] md:text-[32px]">
                <p>{statement}</p>
                <br />
                <p className="text-black/50">{statementMuted}</p>
              </div>
            </Reveal>

            <Reveal className="[--rd:0.6s] [--rdelay:0.1s] [--re:cubic-bezier(0.57,0,0.44,1)] [--ry:20px] md:[--ry:40px]">
              <div className="flex w-full flex-col items-start gap-1 text-[28px] leading-[1.2] font-medium tracking-[-0.02em] text-black/50 md:w-[385px] md:text-[32px]">
                <div className="flex w-full flex-wrap items-center gap-[7px]">
                  <span className="whitespace-pre">{compareBefore}</span>
                  <WordChip text={compareChip} image={compareChipImage} />
                  <span className="whitespace-pre">{compareAfter}</span>
                </div>
                <WordChip text={compareChip2} image={compareChip2Image} imageBelow />
              </div>
            </Reveal>
          </div>
        </div>

        <StatsCard image={image} stats={stats} />
      </div>

      {/* Part 2: heading and three points */}
      <div className="relative z-[2] flex w-full scroll-mt-[180px] flex-col items-center gap-[60px] px-5 md:px-[60px]">
        <div className="flex w-full max-w-[1320px] flex-col items-center gap-[35px] md:gap-[60px]">
          <div className="flex w-full flex-col items-start gap-[5px] md:gap-0">
            <Reveal className="w-full [--rd:0.6s] [--ry:20px] md:[--ry:30px]">
              <p className="w-full max-w-full text-[28px] leading-[1.1] font-medium tracking-[-0.02em] text-black/60 md:w-[424px] md:text-[32px]">
                {kicker}
              </p>
            </Reveal>

            {/* The heading rises out of a clipped box with a slight tilt */}
            <div className="flex h-[117px] w-full flex-col items-start justify-center overflow-hidden md:h-[217px] min-[1280px]:h-[125px]">
              <Reveal
                offset={180}
                observeParent
                className="w-full [--origin:0%_50%] [--rd:0.8s] [--rdelay:0.1s] [--re:cubic-bezier(0.12,0.23,0.5,1)] [--ro:1] [--rr:3deg] [--ry:110px] md:[--ry:95px]"
              >
                <p className="text-[50px] leading-[0.95] font-medium tracking-[-0.05em] text-black md:text-[96px] md:font-normal">
                  {heading}
                </p>
              </Reveal>
            </div>
          </div>

          <div id="backdrop-reveal" className="flex w-full flex-col items-start gap-3 min-[1280px]:flex-row">
            {points.map((point, i) => (
              <Reveal
                key={point.title}
                offset={180}
                className="w-full [--rd:1s] [--re:cubic-bezier(0.51,0.1,0.2,1)] [--rx:30px] [--ry:0px] md:[--rx:0px] md:[--ry:100px] min-[1280px]:w-auto min-[1280px]:flex-1"
                style={
                  {
                    "--rdelay": POINT_DELAYS[i % 3][0],
                    "--rdelay-md": POINT_DELAYS[i % 3][1],
                  } as CSSProperties
                }
              >
                <div className="squircle flex h-[230px] w-full flex-col items-start justify-between bg-black/5 p-6 [--radius:24px] md:h-[300px] md:p-10 min-[1280px]:h-[350px]">
                  {point.icon ? (
                    // eslint-disable-next-line @next/next/no-img-element -- small SVG icon
                    <img src={point.icon} alt="" width={40} height={40} className="size-10 rounded-sm object-cover" />
                  ) : (
                    <div className="size-10 rounded-sm bg-black/10" />
                  )}
                  <div className="flex w-full flex-col items-start gap-6">
                    <p className="text-xl leading-[0.95] font-medium tracking-[-0.02em] text-black">{point.title}</p>
                    <p className="text-xl leading-[1.2] font-medium tracking-[-0.02em] text-black/50">
                      {point.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
