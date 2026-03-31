import Link from "next/link";
import { MediaCard } from "@/components/media-card";
import { NoTmdbState } from "@/components/no-tmdb-state";
import { getCatalog, getGenres, isTmdbConfigured } from "@/lib/tmdb";
import { pickString } from "@/lib/utils";

const movieCategories = [
  { value: "popular", label: "Popular" },
  { value: "top_rated", label: "Top Rated" },
  { value: "upcoming", label: "Upcoming" },
  { value: "now_playing", label: "Now Playing" },
];

export default async function MoviesPage(props: PageProps<"/movies">) {
  if (!isTmdbConfigured()) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-1 items-center px-4 py-16 sm:px-6 lg:px-8">
        <NoTmdbState />
      </div>
    );
  }

  const searchParams = await props.searchParams;
  const category = pickString(searchParams.category, "popular");
  const genre = pickString(searchParams.genre, "all");
  const page = Math.max(1, Number(pickString(searchParams.page, "1")) || 1);

  const [genres, catalog] = await Promise.all([
    getGenres("movie"),
    getCatalog("movie", category, page, genre),
  ]);

  const query = new URLSearchParams();
  query.set("category", catalog.category);
  query.set("genre", genre);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="glass-panel rounded-[2.2rem] p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-soft">
          Movie catalog
        </p>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="display-face text-5xl uppercase text-white">Movies</h1>
            <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
              Filter by category or genre, then jump straight into details or start
              watching in a click.
            </p>
          </div>

          <form className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <select
              name="category"
              defaultValue={catalog.category}
              className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm text-white outline-none"
            >
              {movieCategories.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              name="genre"
              defaultValue={genre}
              className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm text-white outline-none"
            >
              <option value="all">All genres</option>
              {genres.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-[#170d07] hover:bg-accent-soft"
            >
              Apply
            </button>
          </form>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {catalog.items.map((item) => (
          <MediaCard key={item.id} item={item} />
        ))}
      </section>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted">Page {page}</p>
        <div className="flex gap-3">
          {page > 1 ? (
            <Link
              href={`/movies?${(() => {
                const prev = new URLSearchParams(query);
                prev.set("page", String(page - 1));
                return prev.toString();
              })()}`}
              className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/80 hover:border-white/20 hover:text-white"
            >
              Previous
            </Link>
          ) : null}
          {page < catalog.totalPages ? (
            <Link
              href={`/movies?${(() => {
                const next = new URLSearchParams(query);
                next.set("page", String(page + 1));
                return next.toString();
              })()}`}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0c1018] hover:bg-accent-soft"
            >
              Next page
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
