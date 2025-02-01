<script setup lang="ts">
import type { UserWishlistForMember } from '@server/entities/userWishlist'
import { useRouter } from 'vue-router'
const router = useRouter()
withDefaults(
  defineProps<{
    wishlists: UserWishlistForMember[]
    backgroundImageUrl?: string
  }>(),
  {
    backgroundImageUrl:
      'https://cdn.pixabay.com/photo/2017/10/20/20/37/gift-boxes-2872745_960_720.png',
    wishlists: () => [],
  }
)
</script>
<template>
  <div class="p-1">
    <div v-if="wishlists.length === 0" class="text-gray-500">You don't have any wishlists yet.</div>
    <div v-else class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <div
        v-for="wishlist in wishlists"
        :key="wishlist.id"
        @click="router.push({ name: 'WishlistItems', params: { id: wishlist.id } })"
        class="group cursor-pointer border-1 rounded-3xl border-gray-400 p-2 space-y-2"
      >
        <div 
          class="aspect-square rounded-lg bg-cover bg-center"
          :style="{
            backgroundImage: `url(${backgroundImageUrl})`,
          }"
        />
        <h3 class="text-center font-medium text-gray-800 sm:text-lg">
          {{ wishlist.title }}
        </h3>
      </div>
    </div>
  </div>
</template>