import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MediaRail } from "@/components/media-rail";
import { NoTmdbState } from "@/components/no-tmdb-state";
import { getMovieDetails, isTmdbConfigured } from "@/lib/tmdb";
import { formatDate, formatRuntime, formatVote, getWatchHref, tmdbImage } from "@/lib/utils";

export async function generateMetadata(
  props: PageProps<"/movie/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;
  const movie = await getMovieDetails(id);

  if (!movie) {
    return {
      title: "Movie",
    };
  }

  return {
    title: movie.title,
    description: movie.overview,
  };
}

export default async function MovieDetailPage(props: PageProps<"/movie/[id]">) {
  if (!isTmdbConfigured()) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-1 items-center px-4 py-16 sm:px-6 lg:px-8">
        <NoTmdbState />
      </div>
    );
  }

  const { id } = await props.params;
  const movie = await getMovieDetails(id);

  if (!movie) {
    notFound();
  }

  const backdrop = tmdbImage(movie.backdropPath, "original");
  const poster = tmdbImage(movie.posterPath, "w500");

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="glass-panel relative overflow-hidden rounded-[2.5rem]">
        {backdrop ? (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-45"
            style={{ backgroundImage: `url(${backdrop})` }}
          />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(110deg,_rgba(6,8,13,0.98)_0%,_rgba(6,8,13,0.87)_42%,_rgba(6,8,13,0.68)_100%)]" />
        <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[320px_1fr] lg:p-10">
          <div className="relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/5">
            {poster ? (
              <Image
                src={poster}
                alt={movie.title}
                width={500}
                height={750}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[2/3] items-center justify-center px-6 text-center text-sm uppercase tracking-[0.2em] text-white/70">
                {movie.title}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.24em] text-accent-soft">
              Movie detail
            </p>
            <h1 className="display-face mt-4 text-5xl uppercase text-white sm:text-6xl">
              {movie.title}
            </h1>
            {movie.tagline ? (
              <p className="mt-4 text-lg italic text-white/70">{movie.tagline}</p>
            ) : null}
            <p className="mt-6 max-w-3xl text-sm leading-8 text-white/78 sm:text-base">
              {movie.overview}
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/80">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                ★ {formatVote(movie.voteAverage)}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                {formatDate(movie.releaseDate)}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                {formatRuntime(movie.runtime)}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                {movie.status}
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={getWatchHref("movie", movie.id)}
                className="rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#170d07] hover:scale-[1.02] hover:bg-accent-soft"
              >
                Watch movie
              </Link>
              <Link
                href="/movies"
                className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white hover:border-white/18 hover:bg-white/8"
              >
                Back to movies
              </Link>
              {movie.videos[0] ? (
                <a
                  href={`https://www.youtube.com/watch?v=${movie.videos[0].key}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white hover:border-white/18 hover:bg-white/8"
                >
                  Trailer
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-panel rounded-[2rem] p-8">
          <h2 className="display-face text-3xl uppercase text-white">Story + cast</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {movie.genres.map((genre) => (
              <span
                key={genre.id}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/78"
              >
                {genre.name}
              </span>
            ))}
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {movie.cast.map((person) => (
              <div
                key={person.id}
                className="rounded-[1.5rem] border border-white/8 bg-black/18 p-4"
              >
                <p className="font-semibold text-white">{person.name}</p>
                <p className="mt-1 text-sm text-muted">{person.character || "Cast"}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-[2rem] p-8">
          <h2 className="display-face text-3xl uppercase text-white">Production</h2>
          <dl className="mt-6 space-y-4 text-sm text-white/78">
            <div className="rounded-[1.5rem] border border-white/8 bg-black/18 p-4">
              <dt className="text-xs uppercase tracking-[0.2em] text-accent-soft">
                Spoken languages
              </dt>
              <dd className="mt-2 text-base text-white">
                {movie.spokenLanguages.join(", ") || "Unavailable"}
              </dd>
            </div>
            <div className="rounded-[1.5rem] border border-white/8 bg-black/18 p-4">
              <dt className="text-xs uppercase tracking-[0.2em] text-accent-soft">
                Playback route
              </dt>
              <dd className="mt-2 break-all text-base text-white">
                {getWatchHref("movie", movie.id)}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <MediaRail
        title="Recommended After This"
        eyebrow="Similar energy"
        items={movie.recommendations}
      />
    </div>
  );
}
