export function makeReAuthenticationUrl(
  dashboardUrl: string,
  appName: string
): string | undefined {
  try {
    const baseUrl = new URL(dashboardUrl).toString() // will parse and remove trailing slash
    const currentAppUrl = `${window.location.origin}${window.location.pathname}`
    const authUrl = `${baseUrl}/hub/${appName}/authenticate?redirect_to=${currentAppUrl}`
    return new URL(authUrl).toString()
  } catch {
    return undefined
  }
}
