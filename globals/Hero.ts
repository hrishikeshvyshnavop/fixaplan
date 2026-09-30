import type { GlobalConfig } from "payload";
import { revalidateHome } from "./revalidateHome";

// Today's copy, matching the original site. Used as the admin defaults and as the page's
// fallback until the global has been saved once.
export const HERO_DEFAULTS = {
  titleTop: "Plan your day",
  titleBottom: "without",
  titleAccent: "overwhelm",
  description: "Fixa is a simple, ADHD-friendly planner that turns your thoughts into a clear plan",
  ctaNote: "No clutter. No complicated setup. Just your day, clearly planned.",
  ctaLabel: "Join the waitlist",
  videoId: "wXQXtViozUbKjC61PdWpw2",
};

// Hero section text and background video. Anyone can read it (the page does); only admins can change it.
export const Hero: GlobalConfig = {
  slug: "hero",
  label: "Hero",
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  // Edits autosave as drafts, so Live Preview shows them as you type; the site changes on Publish
  versions: {
    drafts: { autosave: { interval: 375 } },
    max: 20,
  },
  hooks: {
    afterChange: [revalidateHome],
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "titleTop",
          label: "Headline, first line",
          type: "text",
          required: true,
          defaultValue: HERO_DEFAULTS.titleTop,
        },
        {
          name: "titleBottom",
          label: "Headline, second line",
          type: "text",
          required: true,
          defaultValue: HERO_DEFAULTS.titleBottom,
        },
        {
          name: "titleAccent",
          label: "Accent word",
          type: "text",
          required: true,
          defaultValue: HERO_DEFAULTS.titleAccent,
          admin: { description: "Italic serif word at the end of the second line" },
        },
      ],
    },
    {
      name: "description",
      type: "textarea",
      required: true,
      defaultValue: HERO_DEFAULTS.description,
      admin: { description: "Sentence under the headline. Keep it short: the box is about 280px wide." },
    },
    {
      type: "row",
      fields: [
        {
          name: "ctaNote",
          label: "Note next to the button",
          type: "text",
          required: true,
          defaultValue: HERO_DEFAULTS.ctaNote,
          admin: { description: "One line on desktop; it doesn't wrap" },
        },
        {
          name: "ctaLabel",
          label: "Button text",
          type: "text",
          required: true,
          defaultValue: HERO_DEFAULTS.ctaLabel,
          admin: { description: "The button always opens the waitlist" },
        },
      ],
    },
    {
      name: "videoId",
      label: "Background video (Kinescope ID)",
      type: "text",
      required: true,
      defaultValue: HERO_DEFAULTS.videoId,
      admin: { description: "The ID from the Kinescope link, e.g. kinescope.io/wXQXtViozUbKjC61PdWpw2" },
      // It goes into the embed URL, so only letters and digits
      validate: (value: string | null | undefined) =>
        !value || /^[A-Za-z0-9]+$/.test(value) || "Letters and digits only (just the ID, not the whole link)",
    },
  ],
};
