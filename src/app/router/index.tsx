import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { NotFoundRoute } from "@/app/router/NotFoundRoute/NotFoundRoute";
import { RouteErrorBoundary } from "@/app/router/RouteErrorBoundary/RouteErrorBoundary";
import { createLazyRouteElement } from "./createLazyRouteElement/createLazyRouteElement";

const MovieSearch = lazy(async () => {
  const module = await import("@/modules/MovieSearch/ui/MovieSearchView");

  return {
    default: module.MovieSearch,
  };
});

const MovieDetails = lazy(async () => {
  const module = await import("@/modules/MovieDetails/ui/MovieDetailsView");

  return {
    default: module.MovieDetails,
  };
});

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: createLazyRouteElement(<MovieSearch />),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/movies/:movieId",
    element: createLazyRouteElement(<MovieDetails />),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "*",
    element: <NotFoundRoute />,
    errorElement: <RouteErrorBoundary />,
  },
]);
