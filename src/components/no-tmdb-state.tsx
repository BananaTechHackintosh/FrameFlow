export function NoTmdbState() {
  return (
    <div className="glass-panel rounded-[2rem] p-8 text-left">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-soft">
        Setup needed
      </p>
      <h2 className="display-face mt-3 text-3xl uppercase text-white">
        Add your TMDB key
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base">
        This app needs `TMDB_API_KEY` in a local `.env.local` file to load posters,
        search results, genres, movie details, and TV episode data. The watch pages
        are wired to `vidsrc.wtf`, but the catalog experience depends on TMDB.
      </p>
      <pre className="mt-6 overflow-x-auto rounded-3xl border border-white/8 bg-black/35 p-4 text-sm text-white/80">
{`TMDB_API_KEY=your_tmdb_api_key_here
NEXT_PUBLIC_VIDSRC_API_VARIANT=1
NEXT_PUBLIC_VIDSRC_COLOR=ff6e3a`}
      </pre>
    </div>
  );
}
