import { Link } from "react-router-dom";

import styles from "./NotFoundRoute.module.css";
import { Button } from "@/UIKit/Button/Button";

export function NotFoundRoute() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <span className={styles.code}>404</span>
        <h1>Page not found</h1>
        <p>The page you are looking for does not exist or has been moved.</p>
        <Link className={styles.link} to="/">
          <Button as="span">Return to movie search</Button>
        </Link>
      </div>
    </main>
  );
}
