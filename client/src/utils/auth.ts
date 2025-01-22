import type { AuthUser } from '@server/shared/types'

export function getUserFromToken(token: string): AuthUser {
  return JSON.parse(atob(token.split('.')[1])).user
}

export function getUserIdFromToken(token: string) {
  return getUserFromToken(token).id
}

export function getAccessToken(): string | undefined {
  const cookies = document.cookie.split(';')
  const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith('access_token='))
  return tokenCookie ? tokenCookie.split('=')[1] : undefined
}
