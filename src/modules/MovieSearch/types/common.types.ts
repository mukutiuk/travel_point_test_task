export type AsyncStatus =
  | 'empty'
  | 'error'
  | 'idle'
  | 'loading'
  | 'refreshing'
  | 'success'

export type Nullable<T> = T | null

export interface SelectOption {
  label: string
  value: string
}
