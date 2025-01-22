import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '@server/shared/trpc'
import { apiBase } from '@/config'
import SuperJSON from 'superjson'

export const trpc = createTRPCProxyClient<AppRouter>({
  transformer: SuperJSON,
  links: [
    httpBatchLink({
      url: apiBase,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include',
        })
      },
    }),
  ],
})
