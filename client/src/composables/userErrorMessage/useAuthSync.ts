import { ref, watch } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { trpc } from '@/trpc'

export function useAuthSync() {
  const { user, isAuthenticated, isLoading } = useAuth0()
  const hasInitialized = ref(false)

  watch(
    [isLoading, () => isAuthenticated, () => user],
    async ([loading, isAuth, authUser]) => {
      if (hasInitialized.value) return
      
      if (!loading && isAuth && authUser?.value?.sub && authUser?.value?.email) {
        try {
          await trpc.user.userSync.mutate({
            auth0Id: authUser.value.sub,
            email: authUser.value.email,
            firstName: authUser.value.given_name || '',
            lastName: authUser.value.family_name || '',
            picture: authUser.value.picture || '',
          })
          hasInitialized.value = true
        } catch (error) {
          console.error('Failed to sync user with database:', error)
        }
      }
    },
    { immediate: true }
  )
}