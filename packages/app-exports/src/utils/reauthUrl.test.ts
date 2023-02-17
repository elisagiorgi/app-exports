import { makeReAuthenticationUrl } from './reauthUrl'

const dashboardUrl = 'https://dashboard.commercelayer.io/test/demo-store'

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

    expect(makeReAuthenticationUrl(dashboardUrl, 'exports')).toBe(
      'https://dashboard.commercelayer.io/test/demo-store/hub/exports/authenticate?redirect_to=https://demo-store.commercelayer.app/exports/new'
    )
  })

  test('should return valid url when current pathname is empty', () => {
    // @ts-expect-error
    window.location.origin = 'https://demo-store.commercelayer.app'
    window.location.pathname = '/'

    expect(makeReAuthenticationUrl(dashboardUrl, 'exports')).toBe(
      'https://dashboard.commercelayer.io/test/demo-store/hub/exports/authenticate?redirect_to=https://demo-store.commercelayer.app/'
    )
  })

  test('should return undefined when dashboard url is invalid', () => {
    // @ts-expect-error
    window.location.origin = 'https://demo-store.commercelayer.app'
    window.location.pathname = '/exports/new'

    expect(makeReAuthenticationUrl('broken-url', 'exports')).toBe(undefined)
  })

  test('should return undefined when app name is invalid', () => {
    // @ts-expect-error
    window.location.origin = 'https://demo-store.commercelayer.app'
    window.location.pathname = '/exports/new'

    expect(makeReAuthenticationUrl(dashboardUrl, '')).toBe(undefined)
  })
})
