import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="glass-panel rounded-[2rem] p-8">
        <p className="text-xs uppercase tracking-[0.24em] text-accent-soft">
          Not found
        </p>
        <h1 className="display-face mt-4 text-4xl uppercase text-white">
          That title or episode could not be loaded.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base">
          The TMDB ID may be invalid, or the selected season and episode do not
          exist for this show.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-[#170d07] hover:bg-accent-soft"
          >
            Go home
          </Link>
          <Link
            href="/search"
            className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/80 hover:text-white"
          >
            Search catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
