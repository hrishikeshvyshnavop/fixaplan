import type { GlobalConfig } from "payload";
import { revalidateHome } from "./revalidateHome";

// Today's copy, matching the original site. Used as the admin defaults and as the page's
// fallback until the global has been saved once.
export const FAQ_DEFAULTS = {
  intro: "We’re here to help. If you didn’t find the answer to your question, feel free to",
  chipText: "email us",
  chipHref: "mailto:info@fixaplan.com",
  introEnd: "anytime.",
  chipImage: "/BdM8sP8QPHpVTvZLxWbdvJIjAhI.png",
  items: [
    {
      question: "Is Fixa made for people with ADHD?",
      answer:
        "Fixa is designed with ADHD-friendly planning in mind: low-friction task creation, less visual noise, and a structure that helps you start without overthinking. It’s not a “perfect productivity” system it’s a calmer way to move through your day.",
    },
    {
      question: "What makes Fixa different from other to-do apps?",
      answer:
        "Most to-do apps give you more features, more lists, and more pressure. Fixa focuses on what actually helps: clarity, gentle structure, and a simple flow that doesn’t overwhelm your brain.",
    },
    {
      question: "Will Fixa help me stay focused?",
      answer:
        "Yes. Fixa includes focus tools like a timer to help you stay in the zone. But the bigger difference is how the app feels: fewer distractions, fewer decisions, and a calmer interface that makes it easier to keep going.",
    },
    {
      question: "Does Fixa replace therapy or ADHD medication?",
      answer:
        "No. Fixa isn’t medical treatment, and it doesn’t replace professional support. It’s a planning tool that can support your day-to-day life alongside whatever works best for you.",
    },
    {
      question: "How do you handle privacy?",
      answer:
        "Your tasks are personal and we treat them that way. We’re building Fixa with privacy and security in mind, and we’ll share clear details before launch so you know exactly what’s stored and why.",
    },
  ],
};

// FAQ section text. Anyone can read it (the page does); only admins can change it.
export const Faq: GlobalConfig = {
  slug: "faq",
  label: "FAQ",
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  hooks: {
    afterChange: [revalidateHome],
  },
  fields: [
    {
      name: "intro",
      type: "textarea",
      required: true,
      defaultValue: FAQ_DEFAULTS.intro,
      admin: { description: "First line of the intro, before the email chip" },
    },
    {
      type: "row",
      fields: [
        { name: "chipText", label: "Chip text", type: "text", required: true, defaultValue: FAQ_DEFAULTS.chipText },
        { name: "chipHref", label: "Chip link", type: "text", required: true, defaultValue: FAQ_DEFAULTS.chipHref },
        { name: "introEnd", label: "Text after the chip", type: "text", defaultValue: FAQ_DEFAULTS.introEnd },
      ],
    },
    {
      name: "chipImage",
      label: "Chip hover image",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "Pops up above the chip on hover. Shown at 222×150 (landscape, about 3:2). Empty uses the original picture.",
      },
    },
    {
      name: "items",
      label: "Questions",
      type: "array",
      minRows: 1,
      defaultValue: FAQ_DEFAULTS.items,
      admin: { initCollapsed: true },
      fields: [
        { name: "question", type: "text", required: true },
        { name: "answer", type: "textarea", required: true },
      ],
    },
  ],
};
