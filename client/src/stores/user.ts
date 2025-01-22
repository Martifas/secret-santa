// stores/user.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAccessToken, getUserIdFromToken } from '@/utils/auth'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const userId = ref<string | null>(null)

  async function updateAuthState(isAuthenticated: boolean, user: any | null) {
    try {
      isLoggedIn.value = isAuthenticated
      
      if (isAuthenticated && user) {
        const token = await getAccessToken()
        if (token) {
          userId.value = getUserIdFromToken(token)
        }
      } else {
        userId.value = null
      }
    } catch (error) {
      console.error('Error updating auth state:', error)
      isLoggedIn.value = false
      userId.value = null
    }
  }

  return {
    isLoggedIn,
    userId,
    updateAuthState,
  }
})