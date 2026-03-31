import {
  Genre,
  MediaSummary,
  MediaType,
  MovieDetails,
  SeasonDetails,
  TvDetails,
} from "@/lib/types";
import { getTitle } from "@/lib/utils";

const TMDB_BASE_URL =
  process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";

type TmdbResult = {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  genre_ids?: number[];
  media_type?: MediaType | "person";
};

type TmdbListResponse<T> = {
  page: number;
  results: T[];
  total_pages: number;
};

function getApiKey() {
  return process.env.TMDB_API_KEY?.trim();
}

export function isTmdbConfigured() {
  return Boolean(getApiKey());
}

async function tmdbFetch<T>(
  path: string,
  params?: Record<string, string | number | undefined>,
): Promise<T | null> {
  const apiKey = getApiKey();

  if (!apiKey) {
    return null;
  }

  const normalizedBase = TMDB_BASE_URL.endsWith("/")
    ? TMDB_BASE_URL
    : `${TMDB_BASE_URL}/`;
  const normalizedPath = path.replace(/^\/+/, "");
  const url = new URL(normalizedPath, normalizedBase);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("language", "en-US");

  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: 1800 },
    });

    if (!response.ok) {
      console.error(`TMDB request failed: ${response.status} ${url.pathname}`);
      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error("TMDB request error", error);
    return null;
  }
}

function normalizeMediaSummary(result: TmdbResult): MediaSummary | null {
  const mediaType =
    result.media_type && result.media_type !== "person"
      ? result.media_type
      : result.first_air_date
        ? "tv"
        : "movie";

  if (result.media_type === "person") {
    return null;
  }

  return {
    id: result.id,
    mediaType,
    title: getTitle(result),
    overview: result.overview ?? "Overview unavailable.",
    posterPath: result.poster_path,
    backdropPath: result.backdrop_path,
    releaseDate: result.release_date ?? result.first_air_date ?? null,
    voteAverage: result.vote_average ?? 0,
    genreIds: result.genre_ids ?? [],
  };
}

function mapMovieDetails(data: {
  id: number;
  imdb_id: string | null;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  runtime: number | null;
  release_date: string | null;
  vote_average: number;
  genres: Genre[];
  tagline: string;
  status: string;
  spoken_languages: { english_name: string }[];
  credits?: { cast: MovieDetails["cast"] };
  videos?: { results: MovieDetails["videos"] };
  similar?: { results: TmdbResult[] };
}): MovieDetails {
  return {
    id: data.id,
    mediaType: "movie",
    imdbId: data.imdb_id,
    title: data.title,
    overview: data.overview,
    posterPath: data.poster_path,
    backdropPath: data.backdrop_path,
    runtime: data.runtime,
    releaseDate: data.release_date,
    voteAverage: data.vote_average,
    genres: data.genres,
    tagline: data.tagline,
    status: data.status,
    spokenLanguages: data.spoken_languages?.map((item) => item.english_name) ?? [],
    cast: data.credits?.cast?.slice(0, 8) ?? [],
    videos:
      data.videos?.results?.filter((video) => video.site === "YouTube").slice(0, 6) ??
      [],
    recommendations:
      data.similar?.results
        ?.map(normalizeMediaSummary)
        .filter((item): item is MediaSummary => Boolean(item))
        .slice(0, 12) ?? [],
  };
}

function mapTvDetails(data: {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string | null;
  vote_average: number;
  genres: Genre[];
  tagline: string;
  status: string;
  spoken_languages: string[];
  number_of_seasons: number;
  number_of_episodes: number;
  seasons: TvDetails["seasons"];
  credits?: { cast: TvDetails["cast"] };
  similar?: { results: TmdbResult[] };
}): TvDetails {
  return {
    id: data.id,
    mediaType: "tv",
    title: data.name,
    overview: data.overview,
    posterPath: data.poster_path,
    backdropPath: data.backdrop_path,
    releaseDate: data.first_air_date,
    voteAverage: data.vote_average,
    genres: data.genres,
    tagline: data.tagline,
    status: data.status,
    spokenLanguages: data.spoken_languages ?? [],
    cast: data.credits?.cast?.slice(0, 8) ?? [],
    numberOfSeasons: data.number_of_seasons,
    numberOfEpisodes: data.number_of_episodes,
    seasons: data.seasons?.filter((season) => season.season_number >= 1) ?? [],
    recommendations:
      data.similar?.results
        ?.map(normalizeMediaSummary)
        .filter((item): item is MediaSummary => Boolean(item))
        .slice(0, 12) ?? [],
  };
}

export async function getGenres(mediaType: MediaType) {
  const response = await tmdbFetch<{ genres: Genre[] }>(`/genre/${mediaType}/list`);
  return response?.genres ?? [];
}

export async function getTrending(mediaType: "all" | MediaType, page = 1) {
  const response = await tmdbFetch<TmdbListResponse<TmdbResult>>(
    `/trending/${mediaType}/week`,
    { page },
  );

  return (
    response?.results
      ?.map(normalizeMediaSummary)
      .filter((item): item is MediaSummary => Boolean(item)) ?? []
  );
}

export async function getCatalog(
  mediaType: MediaType,
  category: string,
  page = 1,
  genre?: string,
) {
  const allowedMovie = ["popular", "top_rated", "upcoming", "now_playing"];
  const allowedTv = ["popular", "top_rated", "airing_today", "on_the_air"];
  const allowed = mediaType === "movie" ? allowedMovie : allowedTv;
  const safeCategory = allowed.includes(category) ? category : "popular";

  const endpoint =
    genre && genre !== "all"
      ? `/discover/${mediaType}`
      : `/${mediaType}/${safeCategory}`;

  const response = await tmdbFetch<TmdbListResponse<TmdbResult>>(endpoint, {
    page,
    with_genres: genre && genre !== "all" ? genre : undefined,
    sort_by: genre && genre !== "all" ? "popularity.desc" : undefined,
  });

  return {
    items:
      response?.results
        ?.map(normalizeMediaSummary)
        .filter((item): item is MediaSummary => Boolean(item)) ?? [],
    totalPages: response?.total_pages ?? 1,
    category: safeCategory,
  };
}

export async function searchMedia(
  query: string,
  mediaType: "all" | MediaType,
  page = 1,
) {
  const safeQuery = query.trim();

  if (!safeQuery) {
    return { items: [] as MediaSummary[], totalPages: 1 };
  }

  const response = await tmdbFetch<TmdbListResponse<TmdbResult>>(
    mediaType === "all" ? "/search/multi" : `/search/${mediaType}`,
    { page, query: safeQuery, include_adult: "false" },
  );

  return {
    items:
      response?.results
        ?.map(normalizeMediaSummary)
        .filter((item): item is MediaSummary => Boolean(item)) ?? [],
    totalPages: response?.total_pages ?? 1,
  };
}

export async function getMovieDetails(id: number | string) {
  const response = await tmdbFetch<Parameters<typeof mapMovieDetails>[0]>(
    `/movie/${id}`,
    { append_to_response: "credits,videos,similar" },
  );

  return response ? mapMovieDetails(response) : null;
}

export async function getTvDetails(id: number | string) {
  const response = await tmdbFetch<Parameters<typeof mapTvDetails>[0]>(`/tv/${id}`, {
    append_to_response: "credits,similar",
  });

  return response ? mapTvDetails(response) : null;
}

export async function getTvSeason(id: number | string, season: number | string) {
  return tmdbFetch<SeasonDetails>(`/tv/${id}/season/${season}`);
}
