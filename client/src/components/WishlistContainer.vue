<script setup lang="ts">
import type { UserWishlistForMember } from '@server/entities/userWishlist'

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
    <div v-else class="flex justify-center gap-10">
      <div
        v-for="wishlist in wishlists"
        :key="wishlist.id"
        class="flex aspect-square size-32 place-items-end justify-center rounded-lg bg-cover bg-center p-4 sm:size-40"
        :style="{
          backgroundImage: `url(${backgroundImageUrl})`,
        }"
      >
        <div class="h-15 rounded-lg bg-white p-1">
          <h3 class="text-center font-medium text-pretty text-black sm:text-lg">
            {{ wishlist.title }}
          </h3>
        </div>
      </div>
    </div>
  </div>
</template>
