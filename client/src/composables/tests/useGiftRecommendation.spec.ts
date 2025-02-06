import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useGiftRecommendation } from '../useGiftRecommendation'

const API_KEY = import.meta.env.VITE_GIFT_RECOMMENDATION_PUBLIC_KEY

describe('useGiftRecommendation', () => {
  const mockRecommendation = {
    gift: 'Vintage Record Player',
    'price range': '$50-$100',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', vi.fn())
  })

  describe('initial state', () => {
    it('should initialize with default values', () => {
      const { showGiftPrompt, interest, errorMessage, recommendation, isLoading } =
        useGiftRecommendation()

      expect(showGiftPrompt.value).toBe(false)
      expect(interest.value).toBe('')
      expect(errorMessage.value).toBe('')
      expect(recommendation.value).toBeNull()
      expect(isLoading.value).toBe(false)
    })
  })

  describe('openGiftPrompt', () => {
    it('should set showGiftPrompt to true and reset other values', () => {
      const { showGiftPrompt, interest, errorMessage, recommendation, openGiftPrompt } =
        useGiftRecommendation()

      interest.value = 'music'
      errorMessage.value = 'some error'
      recommendation.value = mockRecommendation

      openGiftPrompt()

      expect(showGiftPrompt.value).toBe(true)
      expect(interest.value).toBe('')
      expect(errorMessage.value).toBe('')
      expect(recommendation.value).toBeNull()
    })
  })

  describe('closeGiftPrompt', () => {
    it('should set showGiftPrompt to false and reset other values', () => {
      const { showGiftPrompt, interest, errorMessage, recommendation, closeGiftPrompt } =
        useGiftRecommendation()

      showGiftPrompt.value = true
      interest.value = 'music'
      errorMessage.value = 'some error'
      recommendation.value = mockRecommendation

      closeGiftPrompt()

      expect(showGiftPrompt.value).toBe(false)
      expect(interest.value).toBe('')
      expect(errorMessage.value).toBe('')
      expect(recommendation.value).toBeNull()
    })
  })

  describe('getGiftRecommendation', () => {
    it('should set error message if interest is empty', async () => {
      const { getGiftRecommendation, errorMessage, interest } = useGiftRecommendation()

      interest.value = '   '
      await getGiftRecommendation('$50')

      expect(errorMessage.value).toBe('Please enter an interest')
      expect(fetch).not.toHaveBeenCalled()
    })

    it('should fetch and set recommendation successfully', async () => {
      const mockFetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockRecommendation),
      })
      vi.stubGlobal('fetch', mockFetch)

      const { getGiftRecommendation, interest, recommendation, isLoading, errorMessage } =
        useGiftRecommendation()

      interest.value = 'music'
      const budget = '$50'

      await getGiftRecommendation(budget)

      expect(mockFetch).toHaveBeenCalledWith('https://api.promptjoy.com/api/jQGCwq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          interest: 'music',
          budget: budget,
        }),
      })
      expect(recommendation.value).toEqual(mockRecommendation)
      expect(isLoading.value).toBe(false)
      expect(errorMessage.value).toBe('')
    })

    it('should handle non-ok response', async () => {
      const mockFetch = vi.fn().mockResolvedValueOnce({
        ok: false,
      })
      vi.stubGlobal('fetch', mockFetch)

      const { getGiftRecommendation, interest, recommendation, isLoading, errorMessage } =
        useGiftRecommendation()

      interest.value = 'music'
      await getGiftRecommendation('$50')

      expect(recommendation.value).toBeNull()
      expect(isLoading.value).toBe(false)
      expect(errorMessage.value).toBe('Failed to get recommendation. Please try again.')
    })

    it('should handle fetch error', async () => {
      const mockFetch = vi.fn().mockRejectedValueOnce(new Error('Network error'))
      vi.stubGlobal('fetch', mockFetch)

      const { getGiftRecommendation, interest, recommendation, isLoading, errorMessage } =
        useGiftRecommendation()

      interest.value = 'music'
      const consoleSpy = vi.spyOn(console, 'error')

      await getGiftRecommendation('$50')

      expect(recommendation.value).toBeNull()
      expect(isLoading.value).toBe(false)
      expect(errorMessage.value).toBe('Failed to get recommendation. Please try again.')
      expect(consoleSpy).toHaveBeenCalledWith('Gift recommendation error:', expect.any(Error))
    })

    it('should set and reset loading state', async () => {
      const mockFetch = vi.fn().mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: () => Promise.resolve(mockRecommendation),
                }),
              100
            )
          )
      )
      vi.stubGlobal('fetch', mockFetch)

      const { getGiftRecommendation, interest, isLoading } = useGiftRecommendation()

      interest.value = 'music'

      const promise = getGiftRecommendation('$50')
      expect(isLoading.value).toBe(true)

      await promise
      expect(isLoading.value).toBe(false)
    })
  })
})
