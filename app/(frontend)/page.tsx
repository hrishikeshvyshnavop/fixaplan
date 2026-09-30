import AdhdSection from "@/app/components/AdhdSection";
import FaqSection from "@/app/components/FaqSection";
import FeaturesSection from "@/app/components/FeaturesSection";
import FixaAiSection from "@/app/components/FixaAiSection";
import Footer from "@/app/components/Footer";
import FixedBackdrop from "@/app/components/FixedBackdrop";
import HeroSection from "@/app/components/HeroSection";
import LivePreviewBar from "@/app/components/LivePreviewBar";
import Header from "@/app/components/Header";
import Intro from "@/app/components/Intro";
import NextStepSection from "@/app/components/NextStepSection";
import WaitlistDialog from "@/app/components/WaitlistDialog";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/app/site";
import { WAITLIST_HASH } from "@/app/waitlist/constants";
import config from "@payload-config";
import { draftMode } from "next/headers";
import { getPayload } from "payload";
import { FAQ_DEFAULTS } from "@/globals/Faq";
import { HERO_DEFAULTS } from "@/globals/Hero";

// Hero text and video from Payload (/admin → Globals → Hero). Empty fields fall back to today's text.
// `draft` (Live Preview only) reads the latest autosave instead of the published text.
async function getHero(draft: boolean): Promise<typeof HERO_DEFAULTS> {
  const payload = await getPayload({ config });
  const saved = await payload.findGlobal({ slug: "hero", draft });
  return {
    titleTop: saved.titleTop || HERO_DEFAULTS.titleTop,
    titleBottom: saved.titleBottom || HERO_DEFAULTS.titleBottom,
    titleAccent: saved.titleAccent || HERO_DEFAULTS.titleAccent,
    description: saved.description || HERO_DEFAULTS.description,
    ctaNote: saved.ctaNote || HERO_DEFAULTS.ctaNote,
    ctaLabel: saved.ctaLabel || HERO_DEFAULTS.ctaLabel,
    videoId: saved.videoId || HERO_DEFAULTS.videoId,
  };
}

// FAQ text from Payload (edited at /admin → Globals → FAQ). Until it's saved there, or if an
// entry is left empty, today's text is used.
async function getFaq(draft: boolean): Promise<typeof FAQ_DEFAULTS> {
  const payload = await getPayload({ config });
  const saved = await payload.findGlobal({ slug: "faq", depth: 1, draft });
  return {
    intro: saved.intro || FAQ_DEFAULTS.intro,
    chipText: saved.chipText || FAQ_DEFAULTS.chipText,
    chipHref: saved.chipHref || FAQ_DEFAULTS.chipHref,
    introEnd: saved.introEnd ?? FAQ_DEFAULTS.introEnd,
    chipImage: (typeof saved.chipImage === "object" && saved.chipImage?.url) || FAQ_DEFAULTS.chipImage,
    items: saved.items?.length
      ? saved.items.map(({ question, answer }) => ({ question, answer }))
      : FAQ_DEFAULTS.items,
  };
}

// Structured data for search engines: who we are, the site, and the FAQ (same questions as on the page)
function jsonLd(faq: typeof FAQ_DEFAULTS) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Fixa",
        url: SITE_URL,
        logo: `${SITE_URL}/icon-light.svg`,
        email: "info@fixaplan.com",
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        url: SITE_URL,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };
}

export default async function Home() {
  // Only on for admins who came through /preview; everyone else gets the static page
  const { isEnabled: preview } = await draftMode();
  const [hero, faq] = await Promise.all([getHero(preview), getFaq(preview)]);

  return (
    <>
      <Intro text="Now is the time." />
      <Header
        logo="Fixa."
        links={[
          { label: "Features", href: "#features" },
          { label: "Fixa AI", href: "#fixa-ai" },
          { label: "FAQ", href: "#faq" },
        ]}
      />
      {/* Fixed layer behind the page; its grey cover clears when the ADHD cards are fully on screen */}
      <FixedBackdrop revealId="backdrop-reveal" />
      {/* Same flex column as <body>, so the sections' overlapping negative margins behave as before */}
      <main className="flex w-full flex-col">
        <HeroSection
          titleTop={hero.titleTop}
          titleBottom={hero.titleBottom}
          titleAccent={hero.titleAccent}
          description={hero.description}
          ctaNote={hero.ctaNote}
          ctaLabel={hero.ctaLabel}
          ctaHref={WAITLIST_HASH}
          videoId={hero.videoId}
        />
        <AdhdSection
          label="ADHD-Friendly"
          statement="Here, you stop fighting your brain and start working with it."
          statementMuted="We provide clear tools designed specifically for people with ADHD."
          compareBefore="More"
          compareChip="calm inside"
          compareChipImage="/mJ0uiiy26AcyIZz3z6UuBJEyE.png"
          compareAfter="— more"
          compareChip2="impact outside"
          compareChip2Image="/CZeQCKZ6tcknwV8YLClLyhpWkD0.png"
          image="/WXKx26vqrAI7XfrXAgsHkTeOeV0.avif"
          stats={[
            // End widths measured on the original (desktop / phone)
            { label: "Anxiety", from: 80, to: 21, widthFrom: 83, widthTo: 24, widthToPhone: 33 },
            { label: "Productivity", from: 21, to: 80, widthFrom: 30, widthTo: 80, widthToPhone: 79 },
          ]}
          kicker="Traditional planners don’t work well for many people"
          heading="Fixa is designed differently"
          points={[
            {
              title: "Know what to do next",
              icon: "/5NUkqDh3kJPn2rhwmns9gamzMQ.svg",
              description: "Fixa removes the clutter that makes planning feel exhausting.",
            },
            {
              title: "One simple plan for today",
              icon: "/Ho1qO7AvH3djjKiXA0IhXjiGpI.svg",
              description: "It helps you focus on today without feeling like you’re falling behind.",
            },
            {
              title: "Add tasks naturally by speaking",
              icon: "/SZBaD6iDJy2EMODsRFm9heVt9TI.svg",
              description: "You can just say what you need to do, and Fixa gently takes it from there.",
            },
          ]}
        />
        <FeaturesSection
          heading="Tools that work with your mind, not against it"
          note={["No clutter. No complicated setup.", "Just your day, clearly planned."]}
          ctaLabel="Join the waitlist"
          ctaHref={WAITLIST_HASH}
          features={[
            {
              title: "Designed for calm, not chaos",
              icon: "/C8VS09XuSMGfnSUc82ZhhMiXRa0.svg",
              image: "/tC5phDS1LNYMA1wQWaeq9OsGW18.avif",
              description:
                "Fixa removes the clutter that makes planning feel exhausting. Every screen is built to be clear, gentle, and easy to follow so you can focus on doing, not figuring things out.",
            },
            {
              title: "The effortless way to begin",
              icon: "/e1sqv6yDZs9eiwA1Vi8zwt9NIMU.svg",
              image: "/wdiyf3RainSE2ei21wGTmn1A8QQ.avif",
              description:
                "When starting feels hard, Fixa offers simple days to begin with — some inspired by familiar celebrity routines.",
            },
            {
              title: "Stay fully focused",
              icon: "/4zWoE0csW9Vb7rrZYYEzg8hRK4.svg",
              image: "/kZW1dq5Sqd0rvMulTBXHA3l3Jd4.avif",
              description:
                "Turn on the timer to stay in the zone and minimize distractions. Knowing how much time you have makes it easier to complete tasks efficiently.",
            },
            {
              title: "Small steps. Zero guilt",
              icon: "/hudgiraFzbszNXbH7xyrzEaC3E.svg",
              image: "/MpwLfV3BL41ih4BTUbGjwjVEyU.avif",
              description:
                "Become the best version of yourself. Grow your streak, celebrate your wins, and trust the process as small wins lead to big transformations.",
            },
          ]}
        />
        <FixaAiSection
          label="Fixa AI"
          statementLead="Meet Fixa AI."
          statement=" Your AI bestie for getting things done without overthinking."
          tabs={[
            {
              title: "Talk like a human",
              image: "/fixai1.webp",
              // The original swaps in a single-phone picture on phones and tablets
              mobileImage: "/PDRF2Gsxmqr44mPyerdApcea0k.webp",
              description:
                "Just say or type what you want to do. Fixa AI gets it, creates the task, and drops it into your day instantly.",
            },
            {
              title: "Always one step ahead",
              image: "/fixai2.avif",
              description:
                "You do not need to explain the details. Fixa AI understands the task, picks the right category, and estimates how long it will take.",
            },
            {
              title: "Control tasks without stress",
              image: "/fixai3.avif",
              description:
                "Move a task to tomorrow or make it more important? No settings. No menus. Just ask Fixa AI and it happens.",
            },
          ]}
        />
        <NextStepSection
          id="next-step"
          afterId="fixa-ai"
          heading="For days when your brain feels too loud."
          ctaLabel="Join the waitlist"
          ctaHref={WAITLIST_HASH}
          lines={["Choose your next step,", "whenever you’re ready"]}
          chips={["Task Breakdown", "Brain Dump", "Priorities", "Small Wins", "Focus Timer"]}
          image="/sj6JNlwzLQYdJHUI6xdUTxyaw.webp"
        />
        <FaqSection
          afterId="next-step"
          intro={faq.intro}
          chipText={faq.chipText}
          chipHref={faq.chipHref}
          chipImage={faq.chipImage}
          introEnd={faq.introEnd}
          items={faq.items}
        >
          <Footer
            tagline="Gentle planning for busy minds"
            logo="Fixa."
            updatesTitle="Get early updates"
            updatesText="Just the essentials from us — never spam, never noise."
            ctaLabel="Join the waitlist"
            ctaHref={WAITLIST_HASH}
            menu={[
              { label: "Home", href: "#" },
              { label: "Features", href: "#features" },
              { label: "Fixa AI", href: "#fixa-ai" },
              { label: "FAQ", href: "#faq" },
            ]}
            email="info@fixaplan.com"
            social={[
              { label: "Instagram", href: "https://www.instagram.com" },
              { label: "LinkedIn", href: "https://www.linkedin.com" },
            ]}
            copyright="© 2026. Fixa. All Rights Reserved."
            credit={{ label: "Midu Studio", href: "https://midu.design/" }}
          />
        </FaqSection>
      </main>
      <WaitlistDialog />
      {preview && <LivePreviewBar />}
      <script
        type="application/ld+json"
        // Escape "<" so no string in the data can close the script tag
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(faq)).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
