import config from "@payload-config";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "payload";

// Live Preview entry (see `admin.livePreview` in payload.config.ts). Turns on draft mode for a
// logged-in admin, so the homepage reads the latest drafts instead of the published text.
export async function GET(request: Request) {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });
  if (!user) {
    return new Response("Log in at /admin to preview drafts.", { status: 401 });
  }

  (await draftMode()).enable();
  redirect("/");
}
