import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAccessToken, getUserIdFromToken } from '@/utils/auth'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const userId = ref<number | null>(null)

  function checkAuthStatus() {
    const token = getAccessToken()
    if (token) {
      isLoggedIn.value = true
      userId.value = getUserIdFromToken(token)
    } else {
      isLoggedIn.value = false
      userId.value = null
    }
  }

  checkAuthStatus()

  return {
    isLoggedIn,
    userId,
    checkAuthStatus,
  }
})
