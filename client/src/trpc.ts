import { createTRPCProxyClient, httpBatchLink, type HTTPHeaders } from '@trpc/client'
import type { AppRouter } from '@server/shared/trpc'
import { apiBase } from '@/config'
import SuperJSON from 'superjson'
import { ref } from 'vue'

const getAccessTokenFn = ref<(() => Promise<string>) | null>(null)

export const setTokenGetter = (fn: () => Promise<string>) => {
  getAccessTokenFn.value = fn
}

export const trpc = createTRPCProxyClient<AppRouter>({
  transformer: SuperJSON,
  links: [
    httpBatchLink({
      url: apiBase,
      async headers() {
        try {
          if (getAccessTokenFn.value) {
            const token = await getAccessTokenFn.value()
            return {
              Authorization: `Bearer ${token}`
            } satisfies HTTPHeaders
          }
          return {}
        } catch (error) {
          console.error('Error getting token:', error)
          return {}
        }
      },
      fetch(url, options) {
        return fetch(url, {
          ...options,
          // credentials: 'include',
        })
      },
    }),
  ],
})