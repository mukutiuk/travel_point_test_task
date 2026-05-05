import type { MovieDetails } from "@/modules/MovieDetails/entity/dto/movieDetails.entity";
import type {
  GenreDto,
  MovieDetailsDto,
} from "@/modules/MovieDetails/entity/dto/movieDetails.types";

function mapGenreDtoToEntity(genre: GenreDto) {
  return {
    id: genre.id,
    name: genre.name,
  };
}

export function mapMovieDetailsDtoToEntity(
  movie: MovieDetailsDto,
): MovieDetails {
  return {
    adult: movie.adult,
    backdropPath: movie.backdrop_path,
    budget: movie.budget,
    genres: movie.genres.map(mapGenreDtoToEntity),
    homepage: movie.homepage,
    id: movie.id,
    imdbId: movie.imdb_id,
    originCountries: movie.origin_country,
    originalLanguage: movie.original_language,
    originalTitle: movie.original_title,
    overview: movie.overview,
    popularity: movie.popularity,
    posterPath: movie.poster_path,
    productionCountries: movie.production_countries.map((country) => ({
      code: country.iso_3166_1,
      name: country.name,
    })),
    releaseDate: movie.release_date,
    revenue: movie.revenue,
    runtime: movie.runtime,
    spokenLanguages: movie.spoken_languages.map((language) => ({
      code: language.iso_639_1,
      englishName: language.english_name,
      name: language.name,
    })),
    status: movie.status,
    tagline: movie.tagline,
    title: movie.title,
    video: movie.video,
    voteAverage: movie.vote_average,
    voteCount: movie.vote_count,
  };
}
