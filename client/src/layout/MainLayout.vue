<script setup lang="ts">
import { FwbNavbarLink } from 'flowbite-vue'
import StackedLayout from './StackedLayout.vue'
import { useAuthStore } from '@/stores/user'
import { computed, watch } from 'vue'  // Remove onMounted
import { useAuth0 } from '@auth0/auth0-vue'
import { trpc } from '@/trpc'

const auth = useAuthStore()
const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0()

// Single watch for auth state changes
watch(
  [isAuthenticated, user],
  async ([isAuth, authUser]) => {
    try {
      // First update auth store
      await auth.updateAuthState(isAuth, authUser)

      // Only sync if we have valid auth data
      if (!isLoading.value && isAuth && authUser?.sub && authUser?.email) {
        await trpc.user.userSync.mutate({
          auth0Id: authUser.sub,
          email: authUser.email,
          firstName: authUser.given_name || '',
          lastName: authUser.family_name || ''
        })
      }
    } catch (error) {
      console.error('Failed to sync user:', error)
    }
  },
  { immediate: true }
)

async function logoutUser() {
  try {
    await logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    })
    await auth.updateAuthState(false, null)
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

const links = computed(() => {
  const baseLinks = [{ label: 'Articles', name: 'Home' }]

  if (isLoading.value) {
    return baseLinks
  }

  if (auth.isLoggedIn) {
    return [
      ...baseLinks,
      { label: 'Write an article', name: 'WriteArticle' },
      { label: 'Logout', action: logoutUser }
    ]
  }

  return [
    ...baseLinks,
    { label: 'Login', action: () => loginWithRedirect() }
  ]
})
</script>

<template>
  <StackedLayout :links="links" />
</template>