import { AxiosError, type AxiosResponse } from 'axios'
import { describe, expect, it } from 'vitest'
import { httpStatus } from './httpStatus'

describe('httpStatus', () => {
  it('extracts the response status from an axios error', () => {
    const error = new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', undefined, undefined, {
      status: 401,
    } as AxiosResponse)

    expect(httpStatus(error)).toBe(401)
  })

  it('returns undefined for an axios error without a response (network failure)', () => {
    expect(httpStatus(new AxiosError('Network Error', 'ERR_NETWORK'))).toBeUndefined()
  })

  it('returns undefined for a non-axios error', () => {
    expect(httpStatus(new Error('boom'))).toBeUndefined()
    expect(httpStatus('nope')).toBeUndefined()
  })
})
