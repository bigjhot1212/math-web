export const DEFAULT_STUDENT_DESTINATION = '/dashboard'

export function getNavigationMode(pathname: string, signedIn: boolean) {
  if (/^\/practice\/[^/]+\/?$/.test(pathname) || pathname === '/premium/practice' || /^\/exam\/[^/]+\/?$/.test(pathname)) return 'session'
  if (pathname === '/admin' || pathname.startsWith('/admin/')) return 'admin'
  const learningRoute = ['/dashboard', '/practice', '/exam', '/treasure', '/courses', '/course', '/profile']
    .some(route => pathname === route || pathname.startsWith(`${route}/`))
  return signedIn && learningRoute ? 'student' : 'public'
}

export function showFloatingSupport(pathname: string) {
  return ['/', '/pricing', '/cart', '/checkout', '/pricing/success'].includes(pathname)
}
