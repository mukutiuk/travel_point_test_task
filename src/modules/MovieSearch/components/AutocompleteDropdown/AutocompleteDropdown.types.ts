export interface AutocompleteDropdownItem {
  id: number | string
  posterUrl: string | null
  subtitle: string
  title: string
  value: string
}

export interface AutocompleteDropdownViewModel {
  items: AutocompleteDropdownItem[]
  showClearHistory: boolean
  statusMessage: string | null
}

export interface AutocompleteDropdownProps {
  isOpen: boolean
  items: AutocompleteDropdownItem[]
  onClearHistory?: () => void
  onSelect: (value: string) => void
  showClearHistory?: boolean
  statusMessage?: string | null
}
