<script setup lang="ts">
import Container from '@/components/Container.vue'
import { trpc } from '@/trpc'
import { useAuth0 } from '@auth0/auth0-vue'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { WishlistForMember } from '@server/entities/wishlistItem'
import { useSanteeStore } from '@/stores/santeeStore'

const santeeStore = useSanteeStore()
const route = useRoute()
const { user } = useAuth0()
const wishlistId = parseInt(route.params.id as string, 10)
const isLoadingItems = ref(true)
const saveError = ref('')
const existingWishlistItems = ref<WishlistForMember[]>([])

async function loadWishlistItems() {
  try {
    isLoadingItems.value = true
    if (!user.value?.sub) {
      console.error('User not authenticated')
      return
    }

    const items = await trpc.wishlistItem.getWishlistItem.query({
      userId: santeeStore.santeeUserId,
      userWishlistId: wishlistId,
    })

    existingWishlistItems.value = items ?? []
  } catch (error) {
    console.error('Failed to load wishlist items:', error)
    saveError.value = 'Failed to load items. Please try again.'
  } finally {
    isLoadingItems.value = false
  }
}

onMounted(() => {
  loadWishlistItems()
})
</script>

<template>
  <Container>
    <!-- Loading State -->
    <div v-if="isLoadingItems" class="flex h-48 items-center justify-center">
      <div class="text-center">
        <div
          class="border-primary inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-r-transparent align-[-0.125em]"
          role="status"
        >
          <span
            class="!absolute !-m-px !h-px !w-px !overflow-hidden !border-0 !p-0 !whitespace-nowrap ![clip:rect(0,0,0,0)]"
            >Loading...</span
          >
        </div>
        <div class="mt-2 text-gray-600">Loading wishlist items...</div>
      </div>
    </div>

    <div v-else class="mx-auto max-w-3xl">
      <!-- Added Items List -->
      <div v-if="existingWishlistItems.length > 0" class="mt-8">
        <h3 class="mb-4 text-xl font-medium text-gray-900">Added Items</h3>
        <div class="grid gap-4 sm:grid-cols-2">
          <div
            v-for="(item, index) in existingWishlistItems"
            :key="item.id"
            class="rounded-lg border border-gray-400 bg-green-100 p-4 shadow-sm transition-all hover:shadow-md"
          >
            <div class="flex items-start justify-between">
              <div>
                <h4 class="font-medium text-gray-900">{{ item.itemName }}</h4>
                <p v-if="item.description" class="mt-1 text-sm text-gray-600">
                  {{ item.description }}
                </p>
                <p v-if="item.price" class="mt-2 text-sm font-medium text-gray-900">
                  €{{ item.price }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
        <p class="text-gray-600">No items added yet! Stay tuned in for updates.</p>
      </div>
    </div>
  </Container>
</template>
