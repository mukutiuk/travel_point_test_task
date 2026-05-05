import { Button } from "@/UIKit/Button";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import styles from "./RouteErrorBoundary.module.css";

function getRouteErrorMessage(error: unknown) {
  if (isRouteErrorResponse(error)) {
    return error.statusText || "The requested page could not be loaded.";
  }

  if (error instanceof Error) {
    if (error.message.includes("Failed to fetch dynamically imported module")) {
      return "This page could not be loaded. Check your connection and try again.";
    }

    return error.message;
  }

  return "Something went wrong while loading this page.";
}

export function RouteErrorBoundary() {
  const error = useRouteError();
  const isChunkLoadError =
    error instanceof Error &&
    error.message.includes("Failed to fetch dynamically imported module");

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <span className={styles.code}>
          {isChunkLoadError ? "LOADING ERROR" : "UNEXPECTED ERROR"}
        </span>
        <h1>
          {isChunkLoadError ? "Unable to load page" : "Something went wrong"}
        </h1>
        <p>{getRouteErrorMessage(error)}</p>
        <div className={styles.actions}>
          <Button onClick={() => window.location.reload()}>Reload page</Button>
          <Button onClick={() => window.location.assign("/")} variant="soft">
            Open movie search
          </Button>
        </div>
      </div>
    </main>
  );
}
