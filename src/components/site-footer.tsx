export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-line">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        <p>FrameFlow uses TMDB for catalog data and vidsrc.wtf for playback embeds.</p>
        <p>
          Built for browsing, detail pages, and continue-watching flows across
          movies and TV.
        </p>
      </div>
    </footer>
  );
}
