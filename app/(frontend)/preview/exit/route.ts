import { draftMode } from "next/headers";

// Leaves draft mode (the "Exit preview" button in LivePreviewBar) and goes back to the published page
export async function POST(request: Request) {
  (await draftMode()).disable();
  return Response.redirect(new URL("/", request.url), 303);
}
