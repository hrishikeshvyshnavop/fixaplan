import AiTabs, { type AiTab } from "@/app/components/AiTabs";
import Reveal from "@/app/components/Reveal";

type FixaAiSectionProps = {
  label?: string;
  /** Statement: the lead part is white, the rest is muted */
  statementLead?: string;
  statement?: string;
  tabs?: AiTab[];
};

export default function FixaAiSection({
  label = "Section label",
  statementLead = "Lead phrase.",
  statement = " A supporting sentence in a softer colour.",
  tabs = [
    { title: "Tab one", description: "One or two sentences explaining the first tab." },
    { title: "Tab two", description: "One or two sentences explaining the second tab." },
    { title: "Tab three", description: "One or two sentences explaining the third tab." },
  ],
}: FixaAiSectionProps) {
  return (
    <section id="fixa-ai" className="relative z-[2] flex w-full flex-col items-center">
      {/* Dark rounded card */}
      <div className="relative flex w-full flex-col items-center gap-[60px] overflow-hidden rounded-3xl bg-[#151515] px-4 py-[100px] md:rounded-[40px] md:px-[60px] md:pt-[160px] md:pb-[120px]">
        <div className="flex w-full flex-col items-start gap-6 px-5 md:w-auto md:max-w-[670px] md:flex-row md:gap-[60px] md:px-0">
          <div className="flex h-9 flex-none items-center rounded-lg bg-white/5 px-3">
            <p className="text-sm leading-[0.95] font-medium text-[rgb(134,134,134)]">{label}</p>
          </div>

          <Reveal className="w-full [--rd:0.6s] [--ry:10px] md:w-auto md:[--ry:35px]">
            <p className="w-full text-[28px] leading-[1.1] font-medium tracking-[-0.02em] text-white/50 md:w-[521px] md:text-[32px]">
              <span className="text-white">{statementLead}</span>
              {statement}
            </p>
          </Reveal>
        </div>

        <Reveal className="flex w-full justify-center [--rd:0.6s] [--ry:10px]">
          <AiTabs tabs={tabs} />
        </Reveal>
      </div>
    </section>
  );
}
