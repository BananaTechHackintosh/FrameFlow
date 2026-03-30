"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/tv", label: "TV" },
  { href: "/search", label: "Search" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-[rgba(6,8,13,0.72)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-3">
            <div className="display-face rounded-2xl border border-white/12 bg-white/6 px-3 py-2 text-lg leading-none text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] group-hover:border-accent/50 group-hover:text-accent-soft">
              FF
            </div>
            <div>
              <p className="display-face text-2xl uppercase text-white">FrameFlow</p>
              <p className="text-xs uppercase tracking-[0.22em] text-muted">
                Movie & TV portal
              </p>
            </div>
          </Link>

          <form
            action="/search"
            className="hidden min-w-0 flex-1 items-center justify-end md:flex"
          >
            <div className="glass-panel flex w-full max-w-xl items-center gap-3 rounded-full px-4 py-2">
              <input
                type="search"
                name="q"
                placeholder="Search for movies and series..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-muted"
              />
              <button
                type="submit"
                className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-[#1b0d06] hover:scale-[1.02] hover:bg-accent-soft"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                  active
                    ? "border-accent/60 bg-accent/18 text-white"
                    : "border-white/8 bg-white/4 text-muted hover:border-white/14 hover:bg-white/7 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
