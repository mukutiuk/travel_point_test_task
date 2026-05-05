import { memo } from "react";
import type { AutocompleteDropdownProps } from './AutocompleteDropdown.types'
import styles from './AutocompleteDropdown.module.css'

export const AutocompleteDropdown = memo(function AutocompleteDropdown({
  isOpen,
  items,
  onClearHistory,
  onSelect,
  showClearHistory = false,
  statusMessage = null,
}: AutocompleteDropdownProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className={styles.dropdown} role="listbox">
      {items.length > 0
        ? items.map((item) => (
            <button
              className={styles.item}
              key={item.id}
              onClick={() => onSelect(item.value)}
              onMouseDown={(event) => event.preventDefault()}
              type="button"
            >
              {item.posterUrl ? (
                <img
                  alt={item.title}
                  className={styles.poster}
                  decoding="async"
                  loading="lazy"
                  src={item.posterUrl}
                />
              ) : (
                <div className={styles.posterFallback}></div>
              )}
              <div className={styles.info}>
                <h4>{item.title}</h4>
                <p>{item.subtitle}</p>
              </div>
            </button>
          ))
        : null}

      {!items.length && statusMessage ? <div className={styles.status}>{statusMessage}</div> : null}

      {showClearHistory && onClearHistory ? (
        <button
          className={styles.historyClearRow}
          onClick={onClearHistory}
          onMouseDown={(event) => event.preventDefault()}
          type="button"
        >
          Clear search history
        </button>
      ) : null}
    </div>
  )
})
