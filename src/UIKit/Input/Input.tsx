import styles from "./Input.module.css";
import type { InputProps } from "./Input.types";

export function Input({ className, ...props }: InputProps) {
  const classes = [styles.control, className].filter(Boolean).join(" ");

  return <input className={classes} {...props} />;
}
