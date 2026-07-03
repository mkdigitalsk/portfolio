// Bump CURRENT to move every route at once; a public v1 URL is a contract — add v2, never change v1.
export const ApiVersion = {
  V1: 'v1',
  CURRENT: 'v1',
} as const

export const API_PREFIX = `/api/${ApiVersion.CURRENT}`
