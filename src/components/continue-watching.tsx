"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getContinueWatchingMeta,
  getStoredContinueWatching,
  progressEventName,
} from "@/lib/progress";
import { ContinueWatchingItem } from "@/lib/types";
import { tmdbImage } from "@/lib/utils";

export function ContinueWatching() {
  const [items, setItems] = useState<ContinueWatchingItem[]>([]);

  useEffect(() => {
    const sync = () => {
      setItems(getStoredContinueWatching().slice(0, 4));
    };

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(progressEventName, sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(progressEventName, sync);
    };
  }, []);

  if (!items.length) {
    return null;
  }

  return (
    <section className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-soft">
          Pick up where you left off
        </p>
        <h2 className="display-face mt-2 text-3xl uppercase text-white">
          Continue Watching
        </h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {items.map((item) => {
          const meta = getContinueWatchingMeta(item);
          const backdrop = tmdbImage(item.backdrop_path || item.poster_path, "w780");

          return (
            <Link
              key={`${item.type}-${item.id}`}
              href={meta.href}
              className="glass-panel hover-lift group animate-rise overflow-hidden rounded-[1.8rem]"
            >
              <div className="relative min-h-56">
                {backdrop ? (
                  <Image
                    src={backdrop}
                    alt={item.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-r from-[#06080dee] via-[#06080dc4] to-[#06080d6e]" />
                <div className="relative flex h-full flex-col justify-end p-6">
                  <p className="text-xs uppercase tracking-[0.22em] text-accent-soft">
                    {item.type === "movie" ? "Movie" : "TV series"}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-white/72">{meta.label}</p>
                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,_#ff6e3a,_#f0ba43)]"
                      style={{ width: `${meta.watchedPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
