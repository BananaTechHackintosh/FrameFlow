import Link from "next/link";
import { MediaCard } from "@/components/media-card";
import { MediaSummary } from "@/lib/types";

type MediaRailProps = {
  title: string;
  eyebrow: string;
  items: MediaSummary[];
  href?: string;
};

export function MediaRail({ title, eyebrow, items, href }: MediaRailProps) {
  if (!items.length) {
    return null;
  }

  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-soft">
            {eyebrow}
          </p>
          <h2 className="display-face mt-2 text-3xl uppercase text-white">{title}</h2>
        </div>
        {href ? (
          <Link
            href={href}
            className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/80 hover:border-accent/50 hover:text-white"
          >
            View all
          </Link>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {items.map((item) => (
          <MediaCard key={`${item.mediaType}-${item.id}`} item={item} />
        ))}
      </div>
    </section>
  );
}
