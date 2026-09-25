import type { CollectionConfig } from "payload";

// Admin accounts for /admin. Email and password come with `auth`.
export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  auth: true,
  fields: [],
};
