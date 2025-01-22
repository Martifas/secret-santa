export const apiOrigin = (import.meta.env.VITE_API_ORIGIN as string) || window.location.origin
export const apiPath = (import.meta.env.VITE_API_PATH as string) || '/api/v1/trpc'
export const apiBase = `${apiOrigin}${apiPath}`

export const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN as string,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID as string,
  audience: import.meta.env.VITE_AUTH0_AUDIENCE as string,
  redirectUri: window.location.origin,
}

if (typeof apiOrigin !== 'string') {
  throw new Error('VITE_API_ORIGIN is not defined')
}
if (typeof apiPath !== 'string') {
  throw new Error('VITE_API_PATH is not defined')
}
if (typeof auth0Config.domain !== 'string') {
  throw new Error('VITE_AUTH0_DOMAIN is not defined')
}
if (typeof auth0Config.clientId !== 'string') {
  throw new Error('VITE_AUTH0_CLIENT_ID is not defined')
}
if (typeof auth0Config.audience !== 'string') {
  throw new Error('VITE_AUTH0_AUDIENCE is not defined')
}
