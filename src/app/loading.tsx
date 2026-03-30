export default function Loading() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="glass-panel w-full rounded-[2rem] p-8">
        <p className="text-xs uppercase tracking-[0.24em] text-accent-soft">
          Loading
        </p>
        <div className="mt-5 h-4 w-48 animate-pulse rounded-full bg-white/10" />
        <div className="mt-4 h-4 w-80 animate-pulse rounded-full bg-white/10" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="aspect-[2/3] animate-pulse rounded-[1.6rem] bg-white/8"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
