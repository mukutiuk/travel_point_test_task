import styles from "./Loader.module.css";

interface LoaderProps {
  size?: "lg" | "md" | "sm";
}

export function Loader({ size = "md" }: LoaderProps) {
  const classes = [styles.loader, styles[size]].join(" ");

  return <div aria-hidden="true" className={classes}></div>;
}
