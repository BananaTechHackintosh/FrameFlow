import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WatchPlayer } from "@/components/watch-player";
import { getTvDetails, getTvSeason } from "@/lib/tmdb";
import { buildTvEmbedUrl } from "@/lib/vidsrc";
import { getWatchHref } from "@/lib/utils";

export async function generateMetadata(
  props: PageProps<"/watch/tv/[id]/season/[season]/episode/[episode]">,
): Promise<Metadata> {
  const { id, season, episode } = await props.params;
  const show = await getTvDetails(id);

  return {
    title: show
      ? `Watch ${show.title} S${season}E${episode}`
      : `Watch TV S${season}E${episode}`,
    description: show?.overview ?? "TV episode playback page powered by vidsrc.wtf.",
  };
}

export default async function WatchTvEpisodePage(
  props: PageProps<"/watch/tv/[id]/season/[season]/episode/[episode]">,
) {
  const { id, season, episode } = await props.params;
  const [show, seasonData] = await Promise.all([
    getTvDetails(id),
    getTvSeason(id, season),
  ]);

  const selectedEpisode = seasonData?.episodes.find(
    (item) => item.episode_number === Number(episode),
  );

  if (seasonData && !selectedEpisode) {
    notFound();
  }

  const embedUrl = buildTvEmbedUrl(id, season, episode);
  const previousEpisode =
    selectedEpisode && selectedEpisode.episode_number > 1
      ? selectedEpisode.episode_number - 1
      : null;
  const nextEpisode =
    selectedEpisode && seasonData && selectedEpisode.episode_number < seasonData.episodes.length
      ? selectedEpisode.episode_number + 1
      : null;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={show ? `/tv/${show.id}?season=${season}` : "/tv"}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:border-white/18 hover:text-white"
        >
          Back to show
        </Link>
        <span className="rounded-full border border-accent/25 bg-accent/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent-soft">
          Season {season} • Episode {episode}
        </span>
      </div>

      <WatchPlayer
        title={
          show
            ? `${show.title} • S${season}E${episode}${
                selectedEpisode ? ` • ${selectedEpisode.name}` : ""
              }`
            : `TV Episode ${id}`
        }
        embedUrl={embedUrl}
        hint="Resume state and last watched episode are stored from vidsrc.wtf postMessage events, matching the documented MEDIA_DATA payload."
      />

      <section className="glass-panel rounded-[2rem] p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.24em] text-accent-soft">
              Episode guide
            </p>
            <h1 className="display-face mt-3 text-4xl uppercase text-white">
              {selectedEpisode?.name ?? `Episode ${episode}`}
            </h1>
            <p className="mt-4 text-sm leading-8 text-muted sm:text-base">
              {selectedEpisode?.overview ??
                show?.overview ??
                "Episode overview unavailable."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {previousEpisode ? (
              <Link
                href={getWatchHref("tv", id, season, previousEpisode)}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:border-white/18 hover:text-white"
              >
                Previous episode
              </Link>
            ) : null}
            {nextEpisode ? (
              <Link
                href={getWatchHref("tv", id, season, nextEpisode)}
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0c1018] hover:bg-accent-soft"
              >
                Next episode
              </Link>
            ) : null}
          </div>
        </div>

        {seasonData ? (
          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {seasonData.episodes.map((item) => (
              <Link
                key={item.id}
                href={getWatchHref("tv", id, season, item.episode_number)}
                className={`rounded-[1.5rem] border p-4 ${
                  item.episode_number === Number(episode)
                    ? "border-accent/50 bg-accent/12"
                    : "border-white/8 bg-black/18 hover:border-white/14 hover:bg-black/24"
                }`}
              >
                <p className="text-xs uppercase tracking-[0.2em] text-accent-soft">
                  Episode {item.episode_number}
                </p>
                <h2 className="mt-2 text-lg font-semibold text-white">{item.name}</h2>
              </Link>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
