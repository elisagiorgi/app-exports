import { makeReAuthenticationUrl } from './reauthUrl'

describe('makeReAuthenticationUrl', () => {
  const { location } = window
  beforeAll(function clearLocation() {
    delete (window as any).location
    ;(window as any).location = {
      ...location,
      href: 'http://domain.com',
      search: ''
    }
  })
  afterAll(function resetLocation() {
    window.location = location
  })

  test('should return valid url', () => {
    // @ts-expect-error
    window.location.origin = 'https://demo-store.commercelayer.app'
    window.location.pathname = '/exports/new'

    expect(
      makeReAuthenticationUrl(
        'https://dashboard.commercelayer.io/test/demo-store',
        'exports'
      )
    ).toBe(
      'https://dashboard.commercelayer.io/test/demo-store/hub/exports/authenticate?redirect_to=https://demo-store.commercelayer.app/exports/new'
    )
  })

  test('should return undefined when dashboard url is invalid', () => {
    // @ts-expect-error
    window.location.origin = 'https://demo-store.commercelayer.app'
    window.location.pathname = '/exports/new'

    expect(makeReAuthenticationUrl('broken-url', 'exports')).toBe(undefined)
  })
})
