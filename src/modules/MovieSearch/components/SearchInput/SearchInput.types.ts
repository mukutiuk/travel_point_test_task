export interface SearchInputProps {
  onChange: (value: string) => void
  onFocus: () => void
  onHideSuggestions: () => void
  onSubmit: () => void
  placeholder?: string
  value: string
}
