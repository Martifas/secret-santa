<script setup lang="ts">
import ActionButton from '@/components/ActionButton.vue'
import Container from '@/components/Container.vue'
import { useWishlistStore } from '@/stores/wishlistStore'
import { trpc } from '@/trpc'
import { useAuth0 } from '@auth0/auth0-vue'
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { TrashIcon } from '@heroicons/vue/24/outline'
import type { WishlistForMember } from '@server/entities/wishlistItem' // Add this import

const wishlistStore = useWishlistStore()
const route = useRoute()
const { user } = useAuth0()
const wishlistId = parseInt(route.params.id as string, 10)

interface WishlistItemForm {
  name: string
  description: string
  price: number | null
  errors: {
    name?: string
    price?: string
  }
}

const existingWishlistItems = ref<WishlistForMember[]>([])
const form = ref<WishlistItemForm>({
  name: '',
  description: '',
  price: null,
  errors: {},
})

const isSubmitting = ref(false)
const showSuccessMessage = ref(false)
const saveSuccess = ref(false)
const saveError = ref('')

const isValid = computed(() => {
  return form.value.name.trim().length > 0 && !form.value.errors.name && !form.value.errors.price
})

async function loadWishlistItems() {
  try {
    if (!user.value?.sub) {
      console.error('User not authenticated')
      return
    }

    const items = await trpc.wishlistItem.getWishlistItem.query({
      userId: user.value.sub,
      userWishlistId: wishlistId,
    })

    existingWishlistItems.value = items ?? []
  } catch (error) {
    console.error('Failed to load wishlist items:', error)
    saveError.value = 'Failed to load items. Please try again.'
  }
}

const validateForm = () => {
  form.value.errors = {}

  if (!form.value.name.trim()) {
    form.value.errors.name = 'Name is required'
  }

  if (form.value.price !== null && form.value.price < 0) {
    form.value.errors.price = 'Price cannot be negative'
  }

  return Object.keys(form.value.errors).length === 0
}

const handleCancel = () => {
  form.value = {
    name: '',
    description: '',
    price: null,
    errors: {},
  }
  showSuccessMessage.value = false
}

async function deleteFromWishlist(itemToDelete: WishlistForMember) {
  try {
    if (!user.value?.sub) {
      throw new Error('User not authenticated')
    }

    await trpc.wishlistItem.deleteWishlistItem.mutate({
      userId: user.value.sub,
      userWishlistId: wishlistId,
      itemName: itemToDelete.itemName,
    })

    await loadWishlistItems()
    saveSuccess.value = true
    saveError.value = ''
  } catch (error) {
    console.error('Failed to delete gift:', error)
    saveError.value = 'Failed to delete item. Please try again.'
  }
}

async function addGiftToList() {
  if (!validateForm()) return

  try {
    isSubmitting.value = true
    saveSuccess.value = false
    saveError.value = ''

    if (!user.value?.sub) {
      throw new Error('User not authenticated')
    }

    await trpc.wishlistItem.createWishlistItem.mutate({
      itemName: form.value.name,
      description: form.value.description,
      price: form.value.price ?? 0,
      userId: user.value.sub,
      userWishlistId: wishlistId,
    })

    await loadWishlistItems()
    saveSuccess.value = true
    saveError.value = ''
    handleCancel()
  } catch (error) {
    saveError.value = 'Failed to add gift. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

// Move hooks to the end
onMounted(() => {
  loadWishlistItems()
})

watch(
  () => user.value?.sub,
  (newValue) => {
    if (newValue) {
      loadWishlistItems()
    }
  }
)
</script>

<template>
  <Container>
    <div class="mb-8 flex flex-col items-center text-center">
      <h1 class="mb-2 text-3xl font-semibold text-gray-900">{{ wishlistStore.wishlistTitle }}</h1>
      <p class="max-w-2xl text-lg text-gray-600">{{ wishlistStore.wishlistDescription }}</p>
    </div>

    <div class="mx-auto max-w-3xl">
      <div class="mb-6 rounded-lg border border-gray-400 bg-blue-50 p-6 shadow-sm">
        <h2 class="mb-4 text-center text-xl font-medium text-gray-900">Add Gift</h2>

        <div v-if="showSuccessMessage" class="mb-4 rounded-lg bg-green-50 p-4 text-green-700">
          Gift added successfully!
        </div>

        <form @submit.prevent="addGiftToList" class="space-y-4">
          <!-- Name Input -->
          <div class="space-y-1">
            <label for="name" class="mb-2 block text-sm font-medium text-gray-900">
              Enter the name of the item <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              v-model="form.name"
              :class="{ 'border-red-500': form.errors.name }"
              placeholder="Name"
              class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            />
            <p v-if="form.errors.name" class="mt-1 text-sm text-red-500">{{ form.errors.name }}</p>
          </div>

          <!-- Description Input -->
          <div class="space-y-1">
            <label for="description" class="mb-2 block text-sm font-medium text-gray-900">
              Enter description (optional)
            </label>
            <textarea
              id="description"
              v-model="form.description"
              rows="3"
              placeholder="Description"
              class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <!-- Price Input -->
          <div class="space-y-1">
            <label for="price" class="mb-2 block text-sm font-medium text-gray-900">
              Enter price (optional)
            </label>
            <div class="relative flex gap-2">
              <span class="absolute top-2.5 left-3 text-gray-500">€</span>
              <input
                type="number"
                id="price"
                v-model="form.price"
                :class="{ 'border-red-500': form.errors.price }"
                placeholder="0"
                step="1"
                min="0"
                class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-8 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <p v-if="form.errors.price" class="mt-1 text-sm text-red-500">
              {{ form.errors.price }}
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-2 pt-1 pb-1">
            <ActionButton
              type="button"
              variant="secondary"
              @click="handleCancel"
              size="sm"
              :disabled="isSubmitting"
            >
              Cancel
            </ActionButton>
            <ActionButton
              type="submit"
              variant="primary"
              size="sm"
              :disabled="!isValid || isSubmitting"
            >
              Add Item
            </ActionButton>
          </div>

          <div class="flex flex-col items-center">
            <div v-if="saveError" class="text-center text-sm text-red-600">
              {{ saveError }}
            </div>
          </div>
        </form>
      </div>

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
              <button @click="() => deleteFromWishlist(item)" class="my-auto">
                <TrashIcon class="size-11 rounded-full border-1 bg-white p-1 hover:bg-red-200" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
        <p class="text-gray-600">No items added yet. Start by adding your first gift above!</p>
      </div>
    </div>
  </Container>
</template>
