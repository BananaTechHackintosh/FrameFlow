import type { Metadata } from "next";
import Link from "next/link";
import { MediaRail } from "@/components/media-rail";
import { WatchPlayer } from "@/components/watch-player";
import { getMovieDetails } from "@/lib/tmdb";
import {
  buildGoDriveMovieEmbedUrl,
  buildMovieEmbedUrl,
  isStreamServer,
} from "@/lib/vidsrc";
import { formatRuntime, formatVote, pickString } from "@/lib/utils";

export async function generateMetadata(
  props: PageProps<"/watch/movie/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;
  const movie = await getMovieDetails(id);

  return {
    title: movie ? `Watch ${movie.title}` : "Watch Movie",
    description: movie?.overview ?? "Movie playback page with multiple streaming servers.",
  };
}

export default async function WatchMoviePage(
  props: PageProps<"/watch/movie/[id]">,
) {
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const movie = await getMovieDetails(id);
  const requestedServer = pickString(searchParams.server);
  const selectedServer = isStreamServer(requestedServer)
    ? requestedServer
    : "vidsrc";
  const servers = [
    {
      id: "vidsrc" as const,
      label: "VidSrc",
      embedUrl: buildMovieEmbedUrl(id),
      supportsProgress: true,
      hint: "Best for everyday watching and picking up where you left off.",
    },
    ...(movie?.imdbId
      ? [
          {
            id: "godrive" as const,
            label: "GoDrive",
            embedUrl: buildGoDriveMovieEmbedUrl(movie.imdbId),
            supportsProgress: false,
            hint: "Try this source if the default stream is slow or unavailable.",
          },
        ]
      : []),
  ];

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={movie ? `/movie/${movie.id}` : "/movies"}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:border-white/18 hover:text-white"
        >
          Back to details
        </Link>
        <span className="rounded-full border border-accent/25 bg-accent/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent-soft">
          Player route
        </span>
      </div>

      <WatchPlayer
        title={movie?.title ?? `Movie ${id}`}
        defaultServer={selectedServer}
        servers={servers}
      />

      {movie ? (
        <>
          <section className="glass-panel rounded-[2rem] p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs uppercase tracking-[0.24em] text-accent-soft">
                  Now playing
                </p>
                <h1 className="display-face mt-3 text-4xl uppercase text-white">
                  {movie.title}
                </h1>
                <p className="mt-4 text-sm leading-8 text-muted sm:text-base">
                  {movie.overview}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-white/80">
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  ★ {formatVote(movie.voteAverage)}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  {formatRuntime(movie.runtime)}
                </span>
              </div>
            </div>
          </section>

          <MediaRail
            title="Keep The Mood Going"
            eyebrow="Up next"
            items={movie.recommendations}
          />
        </>
      ) : null}
    </div>
  );
}
