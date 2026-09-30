// Turns a pasted video link into something the hero can play as a muted, looping background:
// a player page for YouTube, Vimeo and Kinescope links, or the file itself for a direct
// .mp4/.webm link. Anything else is null (the admin rejects it).
export type VideoLink = { kind: "embed" | "file"; src: string };

const ID = /^[A-Za-z0-9_-]+$/;

export function parseVideoLink(link: string): VideoLink | null {
  let url: URL;
  try {
    url = new URL(link.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  const host = url.hostname.replace(/^www\.|^m\./, "");
  const parts = url.pathname.split("/").filter(Boolean);

  if (host === "kinescope.io") {
    // kinescope.io/<id> or kinescope.io/embed/<id>
    const id = parts[0] === "embed" ? parts[1] : parts[0];
    if (!id || !ID.test(id)) return null;
    return {
      kind: "embed",
      src: `https://kinescope.io/embed/${id}?autoplay=1&muted=1&loop=1&playsinline=1&controls=0&preload=auto`,
    };
  }

  if (host === "youtube.com" || host === "youtu.be" || host === "youtube-nocookie.com") {
    // youtu.be/<id>, youtube.com/watch?v=<id>, /shorts/<id>, /embed/<id>, /live/<id>
    const id =
      host === "youtu.be"
        ? parts[0]
        : parts[0] === "watch"
          ? url.searchParams.get("v")
          : ["shorts", "embed", "live"].includes(parts[0]) ? parts[1] : null;
    if (!id || !ID.test(id)) return null;
    // `loop` only works on a one-video playlist of itself
    return {
      kind: "embed",
      src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&playsinline=1&disablekb=1&rel=0`,
    };
  }

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    // vimeo.com/<id>, vimeo.com/<id>/<hash> (unlisted), player.vimeo.com/video/<id>?h=<hash>
    const [id, hash] = parts[0] === "video" ? [parts[1], url.searchParams.get("h")] : [parts[0], parts[1]];
    if (!id || !/^\d+$/.test(id)) return null;
    // `background=1` is Vimeo's autoplay + muted + loop + no controls mode
    const h = hash && ID.test(hash) ? `&h=${hash}` : "";
    return { kind: "embed", src: `https://player.vimeo.com/video/${id}?background=1${h}` };
  }

  if (/\.(mp4|webm)$/i.test(url.pathname)) return { kind: "file", src: url.href };

  return null;
}
