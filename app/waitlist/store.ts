import config from "@payload-config";
import { getPayload } from "payload";

/*
 * Waitlist storage: the Payload `waitlist` collection (see collections/Waitlist.ts).
 * Signups are listed and exportable at /admin.
 */

export type Signup = {
  email: string;
  name?: string;
};

async function findByEmail(email: string) {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "waitlist",
    where: { email: { equals: email } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  return docs[0];
}

/** Adds the signup unless the email is already on the list. Returns its place in line. */
export async function addSignup(signup: Signup): Promise<{ position: number; existing: boolean }> {
  const payload = await getPayload({ config });

  let doc = await findByEmail(signup.email);
  const existing = Boolean(doc);
  if (!doc) {
    try {
      doc = await payload.create({
        collection: "waitlist",
        data: { email: signup.email, name: signup.name },
        overrideAccess: true,
      });
    } catch (err) {
      // Two signups with the same email at once: the unique index rejects the second
      doc = await findByEmail(signup.email);
      if (!doc) throw err;
    }
  }

  const { totalDocs } = await payload.count({
    collection: "waitlist",
    where: { createdAt: { less_than_equal: doc.createdAt } },
    overrideAccess: true,
  });
  return { position: totalDocs, existing };
}
