import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MediaRail } from "@/components/media-rail";
import { NoTmdbState } from "@/components/no-tmdb-state";
import { getTvDetails, getTvSeason, isTmdbConfigured } from "@/lib/tmdb";
import { pickString, formatDate, formatVote, getWatchHref, tmdbImage } from "@/lib/utils";

export async function generateMetadata(
  props: PageProps<"/tv/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;
  const show = await getTvDetails(id);

  if (!show) {
    return {
      title: "TV Show",
    };
  }

  return {
    title: show.title,
    description: show.overview,
  };
}

export default async function TvDetailPage(props: PageProps<"/tv/[id]">) {
  if (!isTmdbConfigured()) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-1 items-center px-4 py-16 sm:px-6 lg:px-8">
        <NoTmdbState />
      </div>
    );
  }

  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const show = await getTvDetails(id);

  if (!show) {
    notFound();
  }

  const defaultSeason = show.seasons[0]?.season_number ?? 1;
  const selectedSeason = Number(pickString(searchParams.season, String(defaultSeason)));
  const season = await getTvSeason(id, selectedSeason);
  const poster = tmdbImage(show.posterPath, "w500");
  const backdrop = tmdbImage(show.backdropPath, "original");
  const startEpisode = season?.episodes[0]?.episode_number ?? 1;

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
                alt={show.title}
                width={500}
                height={750}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[2/3] items-center justify-center px-6 text-center text-sm uppercase tracking-[0.2em] text-white/70">
                {show.title}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.24em] text-accent-soft">
              TV detail
            </p>
            <h1 className="display-face mt-4 text-5xl uppercase text-white sm:text-6xl">
              {show.title}
            </h1>
            {show.tagline ? (
              <p className="mt-4 text-lg italic text-white/70">{show.tagline}</p>
            ) : null}
            <p className="mt-6 max-w-3xl text-sm leading-8 text-white/78 sm:text-base">
              {show.overview}
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/80">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                ★ {formatVote(show.voteAverage)}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                {formatDate(show.releaseDate)}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                {show.numberOfSeasons} seasons
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                {show.numberOfEpisodes} episodes
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={getWatchHref("tv", show.id, selectedSeason, startEpisode)}
                className="rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#170d07] hover:scale-[1.02] hover:bg-accent-soft"
              >
                Watch season {selectedSeason}
              </Link>
              <Link
                href="/tv"
                className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white hover:border-white/18 hover:bg-white/8"
              >
                Back to shows
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="glass-panel rounded-[2rem] p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-accent-soft">
              Season browser
            </p>
            <h2 className="display-face mt-3 text-3xl uppercase text-white">
              Browse episodes
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {show.seasons.map((item) => (
              <Link
                key={item.id}
                href={`/tv/${show.id}?season=${item.season_number}`}
                className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                  item.season_number === selectedSeason
                    ? "border-accent/60 bg-accent/18 text-white"
                    : "border-white/10 bg-white/5 text-white/70 hover:text-white"
                }`}
              >
                Season {item.season_number}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {season?.episodes.map((episode) => (
            <Link
              key={episode.id}
              href={getWatchHref("tv", show.id, selectedSeason, episode.episode_number)}
              className="rounded-[1.6rem] border border-white/8 bg-black/18 p-5 hover:border-accent/40 hover:bg-black/26"
            >
              <p className="text-xs uppercase tracking-[0.22em] text-accent-soft">
                Episode {episode.episode_number}
              </p>
              <h3 className="mt-3 text-xl font-semibold text-white">{episode.name}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">{episode.overview}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-panel rounded-[2rem] p-8">
          <h2 className="display-face text-3xl uppercase text-white">Genres + cast</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {show.genres.map((genre) => (
              <span
                key={genre.id}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/78"
              >
                {genre.name}
              </span>
            ))}
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {show.cast.map((person) => (
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
          <h2 className="display-face text-3xl uppercase text-white">Series info</h2>
          <dl className="mt-6 space-y-4 text-sm text-white/78">
            <div className="rounded-[1.5rem] border border-white/8 bg-black/18 p-4">
              <dt className="text-xs uppercase tracking-[0.2em] text-accent-soft">
                Spoken languages
              </dt>
              <dd className="mt-2 text-base text-white">
                {show.spokenLanguages.join(", ") || "Unavailable"}
              </dd>
            </div>
            <div className="rounded-[1.5rem] border border-white/8 bg-black/18 p-4">
              <dt className="text-xs uppercase tracking-[0.2em] text-accent-soft">
                Current route
              </dt>
              <dd className="mt-2 break-all text-base text-white">
                {getWatchHref("tv", show.id, selectedSeason, startEpisode)}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <MediaRail
        title="More To Queue Up"
        eyebrow="Recommended next"
        items={show.recommendations}
      />
    </div>
  );
}
