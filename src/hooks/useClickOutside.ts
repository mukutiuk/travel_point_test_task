import { useEffect, type RefObject } from 'react'

export function useClickOutside<T extends HTMLElement>(
  reference: RefObject<T | null>,
  onClickOutside: () => void,
) {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target

      if (!(target instanceof Node)) {
        return
      }

      if (!reference.current || reference.current.contains(target)) {
        return
      }

      onClickOutside()
    }

    document.addEventListener('mousedown', handleClick)

    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [onClickOutside, reference])
}
