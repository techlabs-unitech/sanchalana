// Small helper for turning whatever YouTube URL an admin pastes in
// (watch, youtu.be, shorts, embed — with or without extra query params
// like &t= or &list=) into a plain video ID, and back into an embeddable
// URL. Returns null for anything that isn't recognisable so callers can
// just skip rendering the player instead of guessing.

const YOUTUBE_ID_RE = /^[a-zA-Z0-9_-]{11}$/;

export function getYoutubeVideoId(url) {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Someone pasted a bare video ID rather than a URL — accept that too.
  if (YOUTUBE_ID_RE.test(trimmed)) return trimmed;

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^www\./, "").replace(/^m\./, "");

  if (host === "youtu.be") {
    const id = parsed.pathname.slice(1).split("/")[0];
    return YOUTUBE_ID_RE.test(id) ? id : null;
  }

  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (parsed.pathname === "/watch") {
      const id = parsed.searchParams.get("v");
      return id && YOUTUBE_ID_RE.test(id) ? id : null;
    }
    const match = parsed.pathname.match(/^\/(embed|shorts|live)\/([a-zA-Z0-9_-]{11})/);
    if (match) return match[2];
  }

  return null;
}

export function getYoutubeEmbedUrl(url) {
  const id = getYoutubeVideoId(url);
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}
