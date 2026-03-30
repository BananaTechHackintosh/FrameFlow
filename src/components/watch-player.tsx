"use client";

import { useEffect } from "react";
import { progressEventName } from "@/lib/progress";
import { VIDSRC_PROGRESS_KEY, VIDSRC_PROGRESS_ORIGIN } from "@/lib/vidsrc";

type WatchPlayerProps = {
  title: string;
  embedUrl: string;
  hint: string;
};

export function WatchPlayer({ title, embedUrl, hint }: WatchPlayerProps) {
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== VIDSRC_PROGRESS_ORIGIN) {
        return;
      }

      if (event.data?.type === "MEDIA_DATA") {
        window.localStorage.setItem(
          VIDSRC_PROGRESS_KEY,
          JSON.stringify(event.data.data),
        );
        window.dispatchEvent(new Event(progressEventName));
      }
    };

    window.addEventListener("message", onMessage);

    return () => {
      window.removeEventListener("message", onMessage);
    };
  }, []);

  return (
    <section className="space-y-4">
      <div className="glass-panel rounded-[1.8rem] p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-accent-soft">
              vidsrc.wtf player
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-white">{title}</h1>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
            Progress syncing enabled
          </span>
        </div>

        <div className="overflow-hidden rounded-[1.5rem] border border-white/8 bg-black/40">
          <div className="aspect-video">
            <iframe
              src={embedUrl}
              title={title}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              scrolling="no"
              className="h-full w-full border-0"
            />
          </div>
        </div>
      </div>

      <p className="text-sm leading-7 text-muted">{hint}</p>
    </section>
  );
}
