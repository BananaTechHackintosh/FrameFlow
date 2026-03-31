export type MediaType = "movie" | "tv";

export type Genre = {
  id: number;
  name: string;
};

export type MediaSummary = {
  id: number;
  mediaType: MediaType;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string | null;
  voteAverage: number;
  genreIds: number[];
};

export type CastMember = {
  id: number;
  name: string;
  character?: string;
  profile_path: string | null;
};

export type VideoResult = {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
};

export type MovieDetails = {
  id: number;
  mediaType: "movie";
  imdbId: string | null;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  runtime: number | null;
  releaseDate: string | null;
  voteAverage: number;
  genres: Genre[];
  tagline: string;
  status: string;
  spokenLanguages: string[];
  cast: CastMember[];
  videos: VideoResult[];
  recommendations: MediaSummary[];
};

export type EpisodeSummary = {
  id: number;
  name: string;
  episode_number: number;
  still_path: string | null;
  vote_average: number;
  runtime: number | null;
  overview: string;
  air_date: string | null;
};

export type SeasonSummary = {
  id: number;
  season_number: number;
  name: string;
  episode_count: number;
  poster_path: string | null;
  air_date: string | null;
  overview: string;
};

export type SeasonDetails = {
  id: string;
  name: string;
  season_number: number;
  poster_path: string | null;
  overview: string;
  air_date: string | null;
  episodes: EpisodeSummary[];
};

export type TvDetails = {
  id: number;
  mediaType: "tv";
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string | null;
  voteAverage: number;
  genres: Genre[];
  tagline: string;
  status: string;
  spokenLanguages: string[];
  cast: CastMember[];
  numberOfSeasons: number;
  numberOfEpisodes: number;
  seasons: SeasonSummary[];
  recommendations: MediaSummary[];
};

export type ContinueWatchingItem = {
  id: string;
  type: MediaType;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  progress?: {
    watched: number;
    duration: number;
  };
  last_updated: number;
  last_season_watched?: string;
  last_episode_watched?: string;
};
