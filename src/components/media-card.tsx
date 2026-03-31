import Image from "next/image";
import Link from "next/link";
import { MediaSummary } from "@/lib/types";
import {
  describeMedia,
  formatVote,
  getMediaHref,
  getWatchHref,
  tmdbImage,
  truncate,
} from "@/lib/utils";

export function MediaCard({ item }: { item: MediaSummary }) {
  const poster = tmdbImage(item.posterPath, "w500");
  const detailHref = getMediaHref(item.mediaType, item.id);
  const watchHref = getWatchHref(item.mediaType, item.id);

  return (
    <article className="group animate-rise">
      <div className="glass-panel poster-shine hover-lift overflow-hidden rounded-[1.6rem]">
        <Link href={detailHref} className="block">
          <div className="relative aspect-[2/3] overflow-hidden bg-white/5">
            {poster ? (
              <Image
                src={poster}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 16vw"
                className="object-cover transition duration-500 group-hover:scale-[1.04]"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-[linear-gradient(160deg,_rgba(255,255,255,0.08),_rgba(255,110,58,0.08))] px-6 text-center text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
                {item.title}
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#05070b] via-[#05070baa] to-transparent p-4 pt-12">
              <p className="text-xs uppercase tracking-[0.2em] text-accent-soft">
                {describeMedia(item)}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/72">
                {truncate(item.overview || "No overview available.", 118)}
              </p>
            </div>
          </div>
        </Link>

        <div className="flex items-center justify-between gap-3 border-t border-white/8 px-4 py-3">
          <span className="text-sm font-semibold text-white/90">
            ★ {formatVote(item.voteAverage)}
          </span>
          <div className="flex items-center gap-2">
            <Link
              href={detailHref}
              className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/80 hover:border-white/20 hover:text-white"
            >
              Details
            </Link>
            <Link
              href={watchHref}
              className="rounded-full bg-accent px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#190d07] hover:scale-[1.02] hover:bg-accent-soft"
            >
              Watch
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
