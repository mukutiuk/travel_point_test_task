import styles from "./Select.module.css";
import type { SelectProps } from "./Select.types";

export function Select({ className, options, ...props }: SelectProps) {
  const classes = [styles.control, className].filter(Boolean).join(" ");

  return (
    <select className={classes} {...props}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
