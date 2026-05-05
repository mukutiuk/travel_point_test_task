import type { CheckboxProps } from "./Checkbox.types";
import styles from "./Checkbox.module.css";

export function Checkbox({ checked, id, label, onChange }: CheckboxProps) {
  return (
    <div className={styles.field}>
      <input
        checked={checked}
        className={styles.input}
        id={id}
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
    </div>
  );
}
