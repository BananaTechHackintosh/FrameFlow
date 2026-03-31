"use client";

import { useEffect, useRef, useState } from "react";
import { progressEventName } from "@/lib/progress";
import { StreamServer, VIDSRC_PROGRESS_KEY, VIDSRC_PROGRESS_ORIGIN } from "@/lib/vidsrc";

type PlayerServer = {
  id: StreamServer;
  label: string;
  embedUrl: string;
  supportsProgress: boolean;
  hint: string;
};

type WatchPlayerProps = {
  title: string;
  defaultServer: StreamServer;
  servers: PlayerServer[];
};

export function WatchPlayer({ title, defaultServer, servers }: WatchPlayerProps) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const initialServer =
    servers.find((server) => server.id === defaultServer)?.id ??
    servers[0]?.id ??
    "vidsrc";
  const [activeServer, setActiveServer] = useState(initialServer);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const selectedServer =
    servers.find((server) => server.id === activeServer) ?? servers[0];

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (
        selectedServer?.id !== "vidsrc" ||
        event.origin !== VIDSRC_PROGRESS_ORIGIN
      ) {
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
  }, [selectedServer?.id]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === frameRef.current);
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("server", activeServer);
    window.history.replaceState(null, "", url.toString());
  }, [activeServer]);

  async function toggleFullscreen() {
    if (document.fullscreenElement === frameRef.current) {
      await document.exitFullscreen();
      return;
    }

    await frameRef.current?.requestFullscreen();
  }

  return (
    <section className="space-y-4">
      <div className="glass-panel rounded-[1.8rem] p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-accent-soft">
              Stream player
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-white">{title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
              {selectedServer?.supportsProgress
                ? "Saves your progress"
                : "Alternate source"}
            </span>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">
            Choose a server
          </p>
          <p className="text-sm text-white/60">
            {selectedServer?.supportsProgress
              ? "Recommended for everyday watching"
              : "Use this if the default server is unavailable"}
          </p>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {servers.map((server) => {
            const isActive = server.id === selectedServer?.id;

            return (
              <button
                key={server.id}
                type="button"
                onClick={() => setActiveServer(server.id)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] ${
                  isActive
                    ? "border-accent/50 bg-accent/18 text-white"
                    : "border-white/10 bg-white/5 text-white/70 hover:border-white/18 hover:text-white"
                }`}
              >
                {server.label}
              </button>
            );
          })}
        </div>

        <div
          ref={frameRef}
          className="overflow-hidden rounded-[1.5rem] border border-white/8 bg-black/40"
        >
          <div className="aspect-video">
            <iframe
              key={selectedServer?.id}
              src={selectedServer?.embedUrl}
              title={`${title} - ${selectedServer?.label ?? "Player"}`}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              scrolling="no"
              className="h-full w-full border-0"
            />
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={toggleFullscreen}
            className="rounded-full border border-white/12 bg-black/45 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/85 backdrop-blur-md hover:border-white/24 hover:bg-black/60 hover:text-white"
          >
            {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          </button>
        </div>
      </div>

      <p className="text-sm leading-7 text-muted">{selectedServer?.hint}</p>
    </section>
  );
}
