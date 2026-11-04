export function getAppUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')
}

export function getRequestOrigin(request: Request) {
  const forwardedHost = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim()
  const host = forwardedHost ?? request.headers.get('host')?.split(',')[0]?.trim()
  const forwardedProtocol = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim()

  if (host) {
    const protocol = forwardedProtocol ?? (host.startsWith('localhost') ? 'http' : 'https')
    return `${protocol}://${host}`.replace(/\/$/, '')
  }

  const requestOrigin = new URL(request.url).origin
  return requestOrigin === 'null' ? getAppUrl() : requestOrigin.replace(/\/$/, '')
}
