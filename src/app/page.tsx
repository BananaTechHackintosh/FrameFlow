import Link from "next/link";
import { ContinueWatching } from "@/components/continue-watching";
import { MediaRail } from "@/components/media-rail";
import { NoTmdbState } from "@/components/no-tmdb-state";
import { getCatalog, getTrending, isTmdbConfigured } from "@/lib/tmdb";
import { getWatchHref, tmdbImage, truncate } from "@/lib/utils";

export default async function HomePage() {
  if (!isTmdbConfigured()) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-1 items-center px-4 py-16 sm:px-6 lg:px-8">
        <NoTmdbState />
      </div>
    );
  }

  const [trendingAll, popularMovies, trendingTv, topRatedMovies] =
    await Promise.all([
      getTrending("all"),
      getCatalog("movie", "popular"),
      getCatalog("tv", "popular"),
      getCatalog("movie", "top_rated"),
    ]);

  const featured =
    trendingAll.find((item) => item.backdropPath) ??
    popularMovies.items[0] ??
    trendingTv.items[0];
  const heroImage = tmdbImage(featured?.backdropPath ?? null, "original");

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="glass-panel relative overflow-hidden rounded-[2.5rem]">
        {heroImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-55"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(108deg,_rgba(6,8,13,0.98)_0%,_rgba(6,8,13,0.85)_44%,_rgba(6,8,13,0.32)_100%)]" />
        <div className="relative grid gap-10 px-6 py-10 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-12 lg:py-14">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent-soft">
              Full catalog + instant playback
            </p>
            <h1 className="display-face mt-5 text-5xl uppercase leading-[0.92] text-white sm:text-6xl lg:text-7xl">
              Stream films and series through a cinematic front door.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">
              Browse trending titles, drill into cast and season data, then open a
              `vidsrc.wtf` player route with continue-watching support built in.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={featured ? getWatchHref(featured.mediaType, featured.id) : "/movies"}
                className="rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#170d07] hover:scale-[1.02] hover:bg-accent-soft"
              >
                Start Watching
              </Link>
              <Link
                href="/search"
                className="rounded-full border border-white/14 bg-white/6 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white hover:border-white/24 hover:bg-white/10"
              >
                Explore catalog
              </Link>
            </div>

            {featured ? (
              <div className="mt-10 rounded-[1.8rem] border border-white/10 bg-black/22 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-accent-soft">
                  Featured now
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-white">
                  {featured.title}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-white/72 sm:text-base">
                  {truncate(featured.overview)}
                </p>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-4 lg:items-end">
            <form action="/search" className="glass-panel w-full rounded-[1.8rem] p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-accent-soft">
                Quick search
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <input
                  type="search"
                  name="q"
                  placeholder="Search movies, TV shows, franchises..."
                  className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-muted"
                />
                <div className="flex gap-3">
                  <select
                    name="type"
                    defaultValue="all"
                    className="flex-1 rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                  >
                    <option value="all">All titles</option>
                    <option value="movie">Movies</option>
                    <option value="tv">TV shows</option>
                  </select>
                  <button
                    type="submit"
                    className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[#0b0e15] hover:bg-accent-soft"
                  >
                    Go
                  </button>
                </div>
              </div>
            </form>

            <div className="grid w-full gap-4 sm:grid-cols-3">
              {[
                ["Trending now", `${trendingAll.length}+ picks`],
                ["TV spotlight", `${trendingTv.items.length} live rails`],
                ["Player sync", "Continue watching"],
              ].map(([label, value]) => (
                <div key={label} className="glass-panel rounded-[1.6rem] p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-muted">{label}</p>
                  <p className="display-face mt-3 text-3xl uppercase text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ContinueWatching />

      <MediaRail
        title="Trending Across Movies and TV"
        eyebrow="Hot this week"
        items={trendingAll.slice(0, 10)}
        href="/search?type=all&q=trending"
      />

      <MediaRail
        title="Popular Movies"
        eyebrow="Big-screen picks"
        items={popularMovies.items.slice(0, 10)}
        href="/movies"
      />

      <MediaRail
        title="TV Spotlight"
        eyebrow="Series worth binging"
        items={trendingTv.items.slice(0, 10)}
        href="/tv"
      />

      <MediaRail
        title="Top Rated Tonight"
        eyebrow="Critic-approved"
        items={topRatedMovies.items.slice(0, 10)}
        href="/movies?category=top_rated"
      />
    </div>
  );
}
