import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'

vi.mock('@/trpc', () => ({
  trpc: {
    userEvent: {
      updateWishlistId: {
        mutate: vi.fn(),
      },
      getUserEvent: {
        query: vi.fn(),
      },
    },
    userWishlist: {
      getUserWishlists: {
        query: vi.fn(),
      },
      getUserWishlist: {
        query: vi.fn(),
      },
    },
  },
}))

import { trpc } from '@/trpc'
import { useWishlist } from '../useWishlist'

describe('useWishlist', () => {
  const mockEventId = 123
  const mockUserId = 'user123'
  const mockWishlists = [
    {
      id: 1,
      title: 'Birthday Wishlist',
      description: 'My birthday wishlist',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      userId: 'user123'
    },
    {
      id: 2,
      title: 'Christmas Wishlist',
      description: 'My Christmas wishlist',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      userId: 'user123'
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should initialize with default values', () => {
      const { userWishlists, selectedWishlistTitle, currentWishlistId } = useWishlist(mockEventId, mockUserId)

      expect(userWishlists.value).toEqual([])
      expect(selectedWishlistTitle.value).toBe('')
      expect(currentWishlistId.value).toBeNull()
    })
  })

  describe('getUserWishlists', () => {
    it('should fetch and set user wishlists successfully', async () => {
      vi.mocked(trpc.userWishlist.getUserWishlists.query).mockResolvedValueOnce(mockWishlists)

      const { userWishlists, getUserWishlists } = useWishlist(mockEventId, mockUserId)
      await getUserWishlists()

      expect(trpc.userWishlist.getUserWishlists.query).toHaveBeenCalled()
      expect(userWishlists.value).toEqual(mockWishlists)
    })

    it('should handle error when fetching wishlists', async () => {
      const error = new Error('Failed to fetch wishlists')
      vi.mocked(trpc.userWishlist.getUserWishlists.query).mockRejectedValueOnce(error)
      const consoleSpy = vi.spyOn(console, 'error')

      const { userWishlists, getUserWishlists } = useWishlist(mockEventId, mockUserId)
      await getUserWishlists()

      expect(consoleSpy).toHaveBeenCalledWith('Error fetching wishlists:', error)
      expect(userWishlists.value).toEqual([])
    })
  })

  describe('getInitialWishlist', () => {
    it('should not fetch if userId is undefined', async () => {
      const { getInitialWishlist } = useWishlist(mockEventId, undefined)
      await getInitialWishlist()

      expect(trpc.userEvent.getUserEvent.query).not.toHaveBeenCalled()
    })

    it('should fetch and set initial wishlist successfully', async () => {
      const mockUserEvent = {
        id: 1,
        wishlistId: 1,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        userId: 'user123',
        eventId: mockEventId,
        gifteeName: 'John Doe',
        wishlist: null,
        eventTitle: 'Christmas Party 2024',
        role: 'MEMBER',
        santaForUserId: 'user456'
      }
      const mockWishlist = {
        id: 1,
        title: 'Birthday Wishlist',
        description: 'My birthday wishlist',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        userId: 'user123'
      }

      vi.mocked(trpc.userEvent.getUserEvent.query).mockResolvedValueOnce(mockUserEvent)
      vi.mocked(trpc.userWishlist.getUserWishlist.query).mockResolvedValueOnce(mockWishlist)

      const { selectedWishlistTitle, currentWishlistId, getInitialWishlist } = useWishlist(mockEventId, mockUserId)
      await getInitialWishlist()

      expect(trpc.userEvent.getUserEvent.query).toHaveBeenCalledWith({
        eventId: mockEventId,
        userId: mockUserId,
      })
      expect(trpc.userWishlist.getUserWishlist.query).toHaveBeenCalledWith({
        id: mockUserEvent.wishlistId,
      })
      expect(selectedWishlistTitle.value).toBe(mockWishlist.title)
      expect(currentWishlistId.value).toBe(mockUserEvent.wishlistId)
    })

    it('should handle error when fetching initial wishlist', async () => {
      const error = new Error('Failed to fetch initial wishlist')
      vi.mocked(trpc.userEvent.getUserEvent.query).mockRejectedValueOnce(error)
      const consoleSpy = vi.spyOn(console, 'error')

      const { getInitialWishlist } = useWishlist(mockEventId, mockUserId)
      await getInitialWishlist()

      expect(consoleSpy).toHaveBeenCalledWith('Error fetching initial wishlist:', error)
    })
  })

  describe('selectedWishlistTitle watcher', () => {
    it('should update wishlist ID when title changes', async () => {
      vi.mocked(trpc.userEvent.updateWishlistId.mutate).mockResolvedValueOnce(null)

      const { selectedWishlistTitle, currentWishlistId, userWishlists } = useWishlist(mockEventId, mockUserId)
      
      // Set up initial state
      userWishlists.value = mockWishlists
      
      // Change selected title
      selectedWishlistTitle.value = 'Birthday Wishlist'
      
      // Wait for watch to trigger
      await nextTick()

      expect(trpc.userEvent.updateWishlistId.mutate).toHaveBeenCalledWith({
        eventId: mockEventId,
        wishlistId: 1,
      })
      expect(currentWishlistId.value).toBe(1)
    })

    it('should not update if selected title does not match any wishlist', async () => {
      const { selectedWishlistTitle, userWishlists } = useWishlist(mockEventId, mockUserId)
      
      userWishlists.value = mockWishlists
      selectedWishlistTitle.value = 'Non-existent Wishlist'
      
      await nextTick()

      expect(trpc.userEvent.updateWishlistId.mutate).not.toHaveBeenCalled()
    })
  })
})