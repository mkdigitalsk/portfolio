// Date-only formatting for project timelines. The /account tree is client-only (never SSR'd), so
// locale-dependent Intl formatting is safe here (no hydration mismatch).
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(iso))
}

// Date + time — audit-trail rows (activity history) need the moment, not just the day.
export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso))
}
