import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'

const STORAGE_KEY = 'tmdb-search-history'
const MAX_HISTORY_ITEMS = 8

interface MovieSearchHistoryContextValue {
  addTerm: (term: string) => void
  clearHistory: () => void
  removeTerm: (term: string) => void
  terms: string[]
}

const MovieSearchHistoryContext = createContext<MovieSearchHistoryContextValue | undefined>(
  undefined,
)

function readHistoryFromStorage() {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const serializedValue = window.localStorage.getItem(STORAGE_KEY)

    if (!serializedValue) {
      return []
    }

    const parsedValue = JSON.parse(serializedValue)

    return Array.isArray(parsedValue)
      ? parsedValue.filter((item): item is string => typeof item === 'string')
      : []
  } catch {
    return []
  }
}

export function MovieSearchHistoryProvider({ children }: PropsWithChildren) {
  const [terms, setTerms] = useState<string[]>(readHistoryFromStorage)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(terms))
  }, [terms])

  const addTerm = useCallback((term: string) => {
    const normalizedTerm = term.trim()

    if (!normalizedTerm) {
      return
    }

    setTerms((currentTerms) => {
      const deduplicatedTerms = currentTerms.filter(
        (currentTerm) => currentTerm.toLowerCase() !== normalizedTerm.toLowerCase(),
      )

      return [normalizedTerm, ...deduplicatedTerms].slice(0, MAX_HISTORY_ITEMS)
    })
  }, [])

  const removeTerm = useCallback((term: string) => {
    setTerms((currentTerms) => currentTerms.filter((currentTerm) => currentTerm !== term))
  }, [])

  const clearHistory = useCallback(() => {
    setTerms([])
  }, [])

  const value = useMemo(
    () => ({
      addTerm,
      clearHistory,
      removeTerm,
      terms,
    }),
    [addTerm, clearHistory, removeTerm, terms],
  )

  return (
    <MovieSearchHistoryContext.Provider value={value}>
      {children}
    </MovieSearchHistoryContext.Provider>
  )
}

export function useMovieSearchHistory() {
  const context = useContext(MovieSearchHistoryContext)

  if (!context) {
    throw new Error('useMovieSearchHistory must be used within MovieSearchHistoryProvider')
  }

  return context
}
