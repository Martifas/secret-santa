import { ref, watch } from 'vue'
import { trpc } from '@/trpc'

export function useWishlist(eventId: number) {
  const userWishlists = ref<{ title: string; id: number }[]>([])
  const selectedWishlistTitle = ref<string>('')
  const currentWishlistId = ref<number | null>(null)

  watch(selectedWishlistTitle, async (newTitle) => {
    const selectedWishlist = userWishlists.value.find((wishlist) => wishlist.title === newTitle)
    if (selectedWishlist?.id) {
      await trpc.userEvent.updateWishlistId.mutate({
        eventId: eventId,
        wishlistId: selectedWishlist.id,
      })
      currentWishlistId.value = selectedWishlist.id
    }
  })

  const getUserWishlists = async () => {
    try {
      const wishlists = await trpc.userWishlist.getUserWishlists.query()
      userWishlists.value = wishlists
    } catch (error) {
      console.error('Error fetching wishlists:', error)
    }
  }

  const getInitialWishlist = async () => {
    try {
      const userEvent = await trpc.userEvent.getUserEvent.query({ eventId })
      if (userEvent?.wishlistId) {
        const wishlist = await trpc.userWishlist.getUserWishlist.query({ id: userEvent.wishlistId })
        if (wishlist) {
          selectedWishlistTitle.value = wishlist.title
          currentWishlistId.value = userEvent.wishlistId
        }
      }
    } catch (error) {
      console.error('Error fetching initial wishlist:', error)
    }
  }

  return {
    userWishlists,
    selectedWishlistTitle,
    currentWishlistId,
    getUserWishlists,
    getInitialWishlist
  }
}