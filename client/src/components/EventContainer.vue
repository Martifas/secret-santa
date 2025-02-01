<script setup lang="ts">
import type { UserEventForMember } from '@server/entities/userEvent'

withDefaults(
  defineProps<{
    events: UserEventForMember[]
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
    <div v-if="events.length === 0" class="text-gray-500">You don't have any events yet.</div>
    <div v-else class="flex justify-center gap-10">
      <div
        v-for="event in events"
        :key="event.id"
        class="flex aspect-square size-32 place-items-end justify-center rounded-lg bg-cover bg-center p-4 sm:size-40"
        :style="{
          backgroundImage: `url(https://cdn.pixabay.com/photo/2017/10/20/20/37/gift-boxes-2872745_960_720.png)`,
        }"
      >
        <div class="h-15 rounded-lg bg-white p-1">
          <h3 class="text-center font-medium text-pretty text-black sm:text-lg">
            {{ event.id }}
          </h3>
        </div>
      </div>
    </div>
  </div>
</template>
