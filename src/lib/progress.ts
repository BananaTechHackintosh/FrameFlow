"use client";

import { ContinueWatchingItem } from "@/lib/types";
import { getWatchHref, percentage } from "@/lib/utils";
import { VIDSRC_PROGRESS_KEY } from "@/lib/vidsrc";

export const progressEventName = "vidsrc-progress-updated";

function isRecord(value: unknown): value is Record<string, ContinueWatchingItem> {
  return typeof value === "object" && value !== null;
}

export function parseContinueWatching(
  raw: string | null,
): ContinueWatchingItem[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;

    if (!isRecord(parsed)) {
      return [];
    }

    return Object.values(parsed)
      .filter((item) => item?.id && item?.type && item?.title)
      .sort((left, right) => right.last_updated - left.last_updated);
  } catch {
    return [];
  }
}

export function getStoredContinueWatching() {
  if (typeof window === "undefined") {
    return [];
  }

  return parseContinueWatching(window.localStorage.getItem(VIDSRC_PROGRESS_KEY));
}

export function getContinueWatchingMeta(item: ContinueWatchingItem) {
  const watchedPercent = percentage(
    item.progress?.watched,
    item.progress?.duration,
  );

  return {
    href:
      item.type === "movie"
        ? getWatchHref("movie", item.id)
        : getWatchHref(
            "tv",
            item.id,
            item.last_season_watched ?? 1,
            item.last_episode_watched ?? 1,
          ),
    label:
      item.type === "movie"
        ? "Resume movie"
        : `Resume S${item.last_season_watched ?? 1} • E${
            item.last_episode_watched ?? 1
          }`,
    watchedPercent,
  };
}
