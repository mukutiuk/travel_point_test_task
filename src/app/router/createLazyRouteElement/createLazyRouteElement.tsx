import { Suspense, type ReactNode } from "react";
import { LoadingState } from "@/UIKit/LoadingState";
import styles from "./createLazyRouteElement.module.css";

export function createLazyRouteElement(element: ReactNode) {
  return (
    <Suspense
      fallback={
        <div className={styles.page}>
          <LoadingState message="Loading page..." />
        </div>
      }
    >
      {element}
    </Suspense>
  );
}
