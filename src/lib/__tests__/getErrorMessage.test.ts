import { afterEach, describe, expect, it } from 'vitest'
import { getErrorMessage } from '@/lib/getErrorMessage'

const initialOnLine = navigator.onLine

function setNavigatorOnLine(value: boolean) {
  Object.defineProperty(window.navigator, 'onLine', {
    configurable: true,
    value,
  })
}

describe('getErrorMessage', () => {
  afterEach(() => {
    setNavigatorOnLine(initialOnLine)
  })

  it('returns a dedicated offline message for axios network errors when the browser is offline', () => {
    setNavigatorOnLine(false)

    expect(
      getErrorMessage(
        {
          isAxiosError: true,
          response: undefined,
        },
        'Fallback message',
      ),
    ).toBe('No internet connection. Check your connection and try again.')
  })

  it('returns the api status message when it exists', () => {
    expect(
      getErrorMessage(
        {
          isAxiosError: true,
          message: 'Request failed',
          response: {
            data: {
              status_message: 'The resource you requested could not be found.',
            },
          },
        },
        'Fallback message',
      ),
    ).toBe('The resource you requested could not be found.')
  })

  it('returns the generic error message for regular errors', () => {
    expect(getErrorMessage(new Error('Boom'), 'Fallback message')).toBe('Boom')
  })
})
