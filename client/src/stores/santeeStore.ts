import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSanteeStore = defineStore('santee', () => {
  const santeeUserId = ref('')

  function setSanteeDetails(userId: string) {
    santeeUserId.value = userId
  }

  return {
    santeeUserId,
    setSanteeDetails,
  }
})
