import { describe, expect, it } from 'vitest'
import enGB from '../../locales/en-GB.json'
import skSK from '../../locales/sk-SK.json'
import csCZ from '../../locales/cs-CZ.json'
import deDE from '../../locales/de-DE.json'

// Locale consistency (web-conventions: ENFORCED): en-GB is the reference — every locale must carry
// the exact same keys, the same ICU placeholders per value, and no empty values. A key added only to
// en-GB fails here, in CI — not in front of a client browsing in another language.
const REFERENCE = 'en-GB'
const LOCALES: Record<string, unknown> = { 'sk-SK': skSK, 'cs-CZ': csCZ, 'de-DE': deDE }

type Flat = Record<string, string>

function flatten(node: unknown, prefix = '', out: Flat = {}): Flat {
  if (typeof node === 'string') {
    out[prefix] = node
    return out
  }
  for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
    flatten(value, prefix ? `${prefix}.${key}` : key, out)
  }
  return out
}

const placeholders = (value: string) => [...value.matchAll(/\{(\w+)[,}]/g)].map((m) => m[1]).sort()

const reference = flatten(enGB)

describe('locale parity', () => {
  for (const [locale, messages] of Object.entries(LOCALES)) {
    describe(locale, () => {
      const flat = flatten(messages)

      it(`has exactly the ${REFERENCE} keys`, () => {
        const refKeys = Object.keys(reference).sort()
        const locKeys = Object.keys(flat).sort()
        const missing = refKeys.filter((k) => !(k in flat))
        const extra = locKeys.filter((k) => !(k in reference))
        expect(missing, 'keys missing from this locale').toEqual([])
        expect(extra, 'keys not present in the reference').toEqual([])
      })

      it('has no empty values', () => {
        const empty = Object.entries(flat)
          .filter(([, v]) => v.trim() === '')
          .map(([k]) => k)
        expect(empty).toEqual([])
      })

      it(`keeps the same ICU placeholders as ${REFERENCE}`, () => {
        const drifted = Object.keys(reference)
          .filter((k) => k in flat)
          .filter((k) => placeholders(reference[k]).join() !== placeholders(flat[k]).join())
        expect(drifted, 'values whose {placeholders} differ from the reference').toEqual([])
      })
    })
  }
})
