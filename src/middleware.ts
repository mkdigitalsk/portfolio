import { NextResponse, type NextRequest } from 'next/server'

// Pre-launch privacy gate. The whole site is locked behind HTTP Basic Auth whenever
// SITE_PASSWORD is set (e.g. on the deployed environment). Leave it unset locally and at
// launch to make the site public — going live needs no code change, just drop the env var.
export function middleware(request: NextRequest) {
  const password = process.env.SITE_PASSWORD
  if (!password) return NextResponse.next()

  const user = process.env.SITE_USER ?? 'mk'
  const header = request.headers.get('authorization')

  if (header?.startsWith('Basic ')) {
    const decoded = atob(header.slice(6))
    const separator = decoded.indexOf(':')
    const givenUser = decoded.slice(0, separator)
    const givenPass = decoded.slice(separator + 1)
    if (givenUser === user && givenPass === password) return NextResponse.next()
  }

  return new NextResponse('Authentication required.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="MK Digital — private preview"' },
  })
}

export const config = {
  // Gate everything except Next internals and static files.
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
