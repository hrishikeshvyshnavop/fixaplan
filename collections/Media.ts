import { revalidatePath } from "next/cache";
import type { CollectionConfig } from "payload";

// The homepage is static; rebuild it on the next visit when a picture it may show changes
function refreshHome() {
  try {
    revalidatePath("/");
  } catch {
    // Not inside a Next.js request (e.g. the Payload CLI); nothing to refresh
  }
}

// Uploaded pictures (e.g. the FAQ chip's hover image). Files live in the public Supabase
// Storage bucket `media` (see the s3Storage plugin in payload.config.ts); next/image resizes them.
export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Image", plural: "Media" },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [refreshHome],
    afterDelete: [refreshHome],
  },
  upload: {
    mimeTypes: ["image/png", "image/jpeg", "image/webp", "image/avif", "image/gif"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      admin: { description: "Describes the picture for screen readers. Leave empty if it's only decoration." },
    },
  ],
};
