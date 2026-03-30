import { MediaSummary, MediaType } from "@/lib/types";

const imageBase = "https://image.tmdb.org/t/p";

export function tmdbImage(
  path: string | null,
  size: "w342" | "w500" | "w780" | "original" = "w780",
) {
  if (!path) {
    return null;
  }

  return `${imageBase}/${size}${path}`;
}

export function getTitle(item: { title?: string; name?: string }) {
  return item.title ?? item.name ?? "Untitled";
}

export function getMediaHref(mediaType: MediaType, id: number | string) {
  return mediaType === "movie" ? `/movie/${id}` : `/tv/${id}`;
}

export function getWatchHref(
  mediaType: MediaType,
  id: number | string,
  season?: number | string,
  episode?: number | string,
) {
  if (mediaType === "movie") {
    return `/watch/movie/${id}`;
  }

  return `/watch/tv/${id}/season/${season ?? 1}/episode/${episode ?? 1}`;
}

export function formatYear(date?: string | null) {
  if (!date) {
    return "TBA";
  }

  return new Date(date).getFullYear().toString();
}

export function formatDate(date?: string | null) {
  if (!date) {
    return "Release date unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(date));
}

export function formatRuntime(runtime?: number | null) {
  if (!runtime) {
    return "Runtime unavailable";
  }

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (!hours) {
    return `${minutes}m`;
  }

  return `${hours}h ${minutes}m`;
}

export function formatVote(voteAverage?: number | null) {
  if (!voteAverage) {
    return "NR";
  }

  return voteAverage.toFixed(1);
}

export function percentage(watched = 0, duration = 0) {
  if (!duration) {
    return 0;
  }

  return Math.min(100, Math.max(0, (watched / duration) * 100));
}

export function pickString(value: string | string[] | undefined, fallback = "") {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }

  return value ?? fallback;
}

export function truncate(text: string, max = 170) {
  if (text.length <= max) {
    return text;
  }

  return `${text.slice(0, max - 1).trimEnd()}…`;
}

export function describeMedia(media: MediaSummary) {
  return `${media.mediaType === "movie" ? "Movie" : "TV"} • ${formatYear(
    media.releaseDate,
  )}`;
}
