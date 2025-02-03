<script setup lang="ts">
import Container from '@/components/Container.vue'
import { trpc } from '@/trpc'
import { useAuth0 } from '@auth0/auth0-vue'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { WishlistForMember } from '@server/entities/wishlistItem'
import { useSanteeStore } from '@/stores/santeeStore'
import InsctructionsContainer from '@/components/InsctructionsContainer.vue'

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
        <h3 class="mb-4 text-xl font-medium text-gray-900">Wishlist Items</h3>
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
    <InsctructionsContainer>
      <div>
        <h2 className="text-xl font-bold">Welcome, Secret Santa!</h2>
        <p className="py-2">
          You've been given special access to your giftee's wishlist. This page allows you to view
          their desired items while maintaining the surprise element of Secret Santa. Remember, your
          identity should remain a mystery until the gift exchange!
        </p>
      </div>

      <div>
        <h2 className="pt-7 text-xl font-bold">Understanding the Wishlist</h2>
        <p className="py-2">
          The wishlist above shows items your giftee has specifically chosen. Each item includes
          helpful details to make your gift selection easier and more meaningful.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li><b>Item Names:</b> The main items your giftee would love to receive.</li>
          <li><b>Descriptions:</b> Additional details or specifications about each item.</li>
          <li>
            <b>Price Guidelines:</b> Suggested prices to help you stay within the group's budget.
          </li>
        </ul>
      </div>

      <div>
        <h2 className="mt-7 text-xl font-bold">Shopping Tips</h2>
        <p className="py-2">
          Make the most of this wishlist to ensure your giftee receives something they'll truly
          appreciate:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <b>Check Regularly:</b> Your giftee might update their wishlist, so check back
            occasionally for new items or changes.
          </li>

          <li>
            <b>Budget Wisely:</b> Remember to stick to the agreed-upon budget for the gift exchange.
          </li>
        </ul>
      </div>

      <div>
        <h2 className="mt-7 text-xl font-bold">Keeping the Secret</h2>
        <p className="py-2">
          Maintaining the mystery is key to a successful Secret Santa exchange. Here are some tips
          to keep your identity under wraps:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <b>Anonymous Shopping:</b> If ordering online, ensure your personal details won't be
            included with the gift.
          </li>
          <li>
            <b>Gift Wrapping:</b> Consider using the store's gift wrapping service or wrap the gift
            in a way that doesn't reveal your signature style.
          </li>
          <li>
            <b>Keep it Quiet:</b> Avoid discussing your giftee's wishlist with others in the group
            to maintain the surprise.
          </li>
        </ul>
      </div>

      <div>
        <h2 className="mt-7 text-xl font-bold">Need Help?</h2>
        <p className="py-2">
          If you have any questions about the wishlist or need assistance with the gift exchange,
          feel free to contact the event organizer. They can help you without revealing your
          identity to your giftee.
        </p>
      </div>
    </InsctructionsContainer>
  </Container>
</template>
