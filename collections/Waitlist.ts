import type { CollectionConfig } from "payload";

// Signups from the waitlist modal. Only the server action creates them (with
// overrideAccess), so the public API can't add, read or change entries.
export const Waitlist: CollectionConfig = {
  slug: "waitlist",
  labels: { singular: "Signup", plural: "Waitlist" },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "name", "createdAt"],
  },
  access: {
    create: () => false,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  defaultSort: "createdAt",
  fields: [
    { name: "email", type: "email", required: true, unique: true, index: true },
    { name: "name", type: "text" },
  ],
};
