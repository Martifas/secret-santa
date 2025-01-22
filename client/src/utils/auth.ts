import type { AuthUser } from '@server/shared/types'
import { useAuth0 } from '@auth0/auth0-vue'

export function getUserFromToken(token: string): AuthUser {
  return JSON.parse(atob(token.split('.')[1]))
}

export function getUserIdFromToken(token: string) {
  return getUserFromToken(token).auth0Id
}

export async function getAccessToken(): Promise<string | undefined> {
  try {
    const { getAccessTokenSilently } = useAuth0()
    return await getAccessTokenSilently()
  } catch (error) {
    console.error('Error getting access token:', error)
    return undefined
  }
}
