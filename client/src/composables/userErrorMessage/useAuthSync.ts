import { ref, watch } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { trpc } from '@/trpc'

export function useAuthSync() {
    const { user, isAuthenticated, isLoading, logout, loginWithRedirect } = useAuth0()

  watch(
    [isLoading, () => isAuthenticated, () => user],
    async ([loading, isAuth, authUser]) => {
      if (!loading && isAuth && authUser?.value?.sub && authUser?.value?.email) {
        try {
          await trpc.user.userSync.mutate({
            auth0Id: authUser.value.sub,
            email: authUser.value.email,
            firstName: authUser.value.given_name || '',
            lastName: authUser.value.family_name || '',
            picture: authUser.value.picture || '',
          })
        } catch (error) {
          console.error('Failed to sync user with database:', error)
        }
      }
    },
    { immediate: true }
  )

  async function loginUser() {
    try {
      await loginWithRedirect()
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  async function logoutUser() {
    try {
      await logout({
        logoutParams: {
          returnTo: window.location.origin,
        },
      })
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return {
    isAuthenticated,
    user,
    isLoading,
    loginUser,
    logoutUser,
  }
}
