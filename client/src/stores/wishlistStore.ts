import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWishlistStore = defineStore('wishlist', () => {
  const wishlistTitle = ref('')
  const wishlistDescription = ref('')
  
  function setWishlistDetails(title: string, description: string) {
    wishlistTitle.value = title
    wishlistDescription.value = description
  }

  return {
    wishlistTitle,
    wishlistDescription,
    setWishlistDetails
  }
})