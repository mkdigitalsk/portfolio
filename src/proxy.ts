import { NextResponse, type NextRequest } from 'next/server'

const ACCESS_COOKIE = 'site_access'
const ONE_YEAR = 60 * 60 * 24 * 365

// Pre-launch privacy gate (Next.js 16 "proxy" convention). The whole site is locked behind
// HTTP Basic Auth whenever SITE_PASSWORD is set. Unset it (locally / at launch) to make the
// site public — no code change needed.
//
// To skip the prompt on your own devices: set SITE_BYPASS_TOKEN and visit `/?access=<token>`
// once. That drops a long-lived cookie so this browser is let through silently — and you can
// share that magic link to grant someone access without handing out the password.
export function proxy(request: NextRequest) {
  const password = process.env.SITE_PASSWORD
  if (!password) return NextResponse.next()

  const bypass = process.env.SITE_BYPASS_TOKEN
  if (bypass) {
    const url = new URL(request.url)
    // Magic link: store the bypass cookie, then redirect to the clean URL (without ?access).
    if (url.searchParams.get('access') === bypass) {
      url.searchParams.delete('access')
      const res = NextResponse.redirect(url)
      res.cookies.set(ACCESS_COOKIE, bypass, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: ONE_YEAR,
      })
      return res
    }
    // This browser already holds the bypass cookie → let it through silently.
    if (request.cookies.get(ACCESS_COOKIE)?.value === bypass) return NextResponse.next()
  }

  const user = process.env.SITE_USER ?? 'mk'
  const header = request.headers.get('authorization')
  if (header?.startsWith('Basic ')) {
    const decoded = atob(header.slice(6))
    const separator = decoded.indexOf(':')
    if (decoded.slice(0, separator) === user && decoded.slice(separator + 1) === password) {
      return NextResponse.next()
    }
  }

  // realm must be ASCII / Latin-1 only — HTTP header values are ByteStrings, so a fancy
  // em-dash here throws "Cannot convert argument to a ByteString" and 500s the gate.
  return new NextResponse('Authentication required.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="MK Digital"' },
  })
}

export const config = {
  // Gate everything except Next internals and static files.
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
