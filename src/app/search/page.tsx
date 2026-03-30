import Link from "next/link";
import { MediaCard } from "@/components/media-card";
import { NoTmdbState } from "@/components/no-tmdb-state";
import { isTmdbConfigured, searchMedia } from "@/lib/tmdb";
import { pickString } from "@/lib/utils";

export default async function SearchPage(props: PageProps<"/search">) {
  if (!isTmdbConfigured()) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-1 items-center px-4 py-16 sm:px-6 lg:px-8">
        <NoTmdbState />
      </div>
    );
  }

  const searchParams = await props.searchParams;
  const query = pickString(searchParams.q).trim();
  const type = pickString(searchParams.type, "all") as "all" | "movie" | "tv";
  const page = Math.max(1, Number(pickString(searchParams.page, "1")) || 1);
  const results = query ? await searchMedia(query, type, page) : { items: [], totalPages: 1 };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="glass-panel rounded-[2.2rem] p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-soft">
          Search
        </p>
        <h1 className="display-face mt-4 text-5xl uppercase text-white">
          Find your next watch
        </h1>
        <form className="mt-6 grid gap-3 md:grid-cols-[1fr_180px_auto]">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search by title, series, franchise..."
            className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-muted"
          />
          <select
            name="type"
            defaultValue={type}
            className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm text-white outline-none"
          >
            <option value="all">All titles</option>
            <option value="movie">Movies</option>
            <option value="tv">TV shows</option>
          </select>
          <button
            type="submit"
            className="rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-[#170d07] hover:bg-accent-soft"
          >
            Search
          </button>
        </form>
      </section>

      {!query ? (
        <section className="glass-panel rounded-[2rem] p-8">
          <p className="max-w-2xl text-sm leading-7 text-muted sm:text-base">
            Search across both movies and TV shows, then open detail or watch pages
            from the results grid.
          </p>
        </section>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3">
            {[
              { value: "all", label: "All" },
              { value: "movie", label: "Movies" },
              { value: "tv", label: "TV" },
            ].map((option) => (
              <Link
                key={option.value}
                href={`/search?q=${encodeURIComponent(query)}&type=${option.value}`}
                className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                  option.value === type
                    ? "border-accent/60 bg-accent/18 text-white"
                    : "border-white/10 bg-white/5 text-white/70 hover:text-white"
                }`}
              >
                {option.label}
              </Link>
            ))}
          </div>

          {results.items.length ? (
            <>
              <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {results.items.map((item) => (
                  <MediaCard key={`${item.mediaType}-${item.id}`} item={item} />
                ))}
              </section>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-muted">
                  Results for “{query}” • page {page}
                </p>
                <div className="flex gap-3">
                  {page > 1 ? (
                    <Link
                      href={`/search?q=${encodeURIComponent(query)}&type=${type}&page=${
                        page - 1
                      }`}
                      className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/80 hover:border-white/20 hover:text-white"
                    >
                      Previous
                    </Link>
                  ) : null}
                  {page < results.totalPages ? (
                    <Link
                      href={`/search?q=${encodeURIComponent(query)}&type=${type}&page=${
                        page + 1
                      }`}
                      className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0c1018] hover:bg-accent-soft"
                    >
                      Next page
                    </Link>
                  ) : null}
                </div>
              </div>
            </>
          ) : (
            <section className="glass-panel rounded-[2rem] p-8">
              <p className="text-sm leading-7 text-muted sm:text-base">
                No results matched “{query}”. Try a broader franchise name or switch
                between movies and TV.
              </p>
            </section>
          )}
        </>
      )}
    </div>
  );
}
