import { ref } from 'vue'

interface GiftRecommendation {
  gift: string
  'price range': string
}

export function useGiftRecommendation() {

  const API_KEY = import.meta.env.VITE_GIFT_RECOMMMENDATION_PUBLIC_KEY
  const showGiftPrompt = ref(false)
  const interest = ref('')
  const errorMessage = ref('')
  const recommendation = ref<GiftRecommendation | null>(null)
  const isLoading = ref(false)

  const openGiftPrompt = () => {
    showGiftPrompt.value = true
    interest.value = ''
    errorMessage.value = ''
    recommendation.value = null
  }

  const closeGiftPrompt = () => {
    showGiftPrompt.value = false
    interest.value = ''
    errorMessage.value = ''
    recommendation.value = null
  }

  const getGiftRecommendation = async (budget: string) => {
    if (!interest.value.trim()) {
      errorMessage.value = 'Please enter an interest'
      return
    }

    isLoading.value = true
    errorMessage.value = ''

    try {
      const response = await fetch('https://api.promptjoy.com/api/jQGCwq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          interest: interest.value.toLowerCase(),
          budget: budget,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get recommendation')
      }

      const data = await response.json()
      recommendation.value = data
    } catch (error) {
      errorMessage.value = 'Failed to get recommendation. Please try again.'
      console.error('Gift recommendation error:', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    showGiftPrompt,
    interest,
    errorMessage,
    recommendation,
    isLoading,
    openGiftPrompt,
    closeGiftPrompt,
    getGiftRecommendation,
  }
}
