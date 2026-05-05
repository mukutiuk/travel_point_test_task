import type {
  GenreDto,
  MovieDto,
  SearchMoviesResponseDto,
} from "@/modules/MovieSearch/entity/dto/movieSearch.types";
import type {
  Genre,
  Movie,
  MovieGenreMap,
  MovieSearchResult,
} from "@/modules/MovieSearch/entity/dto/movieSearch";

export function mapGenreDtoToEntity(genre: GenreDto): Genre {
  return {
    id: genre.id,
    name: genre.name,
  };
}

export function mapMovieDtoToEntity(movie: MovieDto): Movie {
  return {
    adult: movie.adult,
    backdropPath: movie.backdrop_path,
    genreIds: movie.genre_ids,
    id: movie.id,
    originalLanguage: movie.original_language,
    originalTitle: movie.original_title,
    overview: movie.overview,
    popularity: movie.popularity,
    posterPath: movie.poster_path,
    releaseDate: movie.release_date,
    title: movie.title,
    video: movie.video,
    voteAverage: movie.vote_average,
    voteCount: movie.vote_count,
  };
}

export function mapMovieSearchResponseToEntity(
  response: SearchMoviesResponseDto,
): MovieSearchResult {
  return {
    movies: response.results.map(mapMovieDtoToEntity),
    page: response.page,
    totalPages: Math.min(response.total_pages, 500),
    totalResults: response.total_results,
  };
}

export function mapGenresToMovieGenreMap(genres: Genre[]): MovieGenreMap {
  return Object.fromEntries(genres.map((genre) => [genre.id, genre.name]));
}
