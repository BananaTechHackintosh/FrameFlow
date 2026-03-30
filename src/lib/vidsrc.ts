export const VIDSRC_PROGRESS_KEY = "vidsrcwtf-Progress";
export const VIDSRC_PROGRESS_ORIGIN = "https://www.vidsrc.wtf";

function getBaseUrl() {
  return (process.env.NEXT_PUBLIC_VIDSRC_BASE_URL || "https://vidsrc.wtf").replace(
    /\/$/,
    "",
  );
}

function getApiVariant() {
  const raw = process.env.NEXT_PUBLIC_VIDSRC_API_VARIANT || "1";
  const parsed = Number(raw);

  if ([1, 2, 3, 4].includes(parsed)) {
    return parsed;
  }

  return 1;
}

function getColor() {
  return (process.env.NEXT_PUBLIC_VIDSRC_COLOR || "ff6e3a").replace("#", "");
}

export function buildMovieEmbedUrl(id: number | string) {
  const url = new URL(`${getBaseUrl()}/api/${getApiVariant()}/movie/`);
  url.searchParams.set("id", String(id));
  url.searchParams.set("color", getColor());
  return url.toString();
}

export function buildTvEmbedUrl(
  id: number | string,
  season: number | string,
  episode: number | string,
) {
  const url = new URL(`${getBaseUrl()}/api/${getApiVariant()}/tv/`);
  url.searchParams.set("id", String(id));
  url.searchParams.set("s", String(season));
  url.searchParams.set("e", String(episode));
  url.searchParams.set("color", getColor());
  return url.toString();
}
