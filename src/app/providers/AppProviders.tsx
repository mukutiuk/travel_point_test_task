import { MovieSearchHistoryProvider } from "@/modules/MovieSearch/presenters/SearchHistoryContext";
import type { PropsWithChildren } from "react";

export function AppProviders({ children }: PropsWithChildren) {
  return <MovieSearchHistoryProvider>{children}</MovieSearchHistoryProvider>;
}
