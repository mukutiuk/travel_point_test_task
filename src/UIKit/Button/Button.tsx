import type { ButtonProps } from "./Button.types";
import styles from "./Button.module.css";

export function Button({
  as = "button",
  className,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  const classes = [styles.button, styles[variant], className]
    .filter(Boolean)
    .join(" ");

  if (as === "span") {
    return <span className={classes}>{props.children}</span>;
  }

  return <button className={classes} type={type} {...props} />;
}
