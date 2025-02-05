<script setup lang="ts">
import type { UserEventForMember } from '@server/entities/userEvent'
import { useRouter } from 'vue-router'
const router = useRouter()

withDefaults(
  defineProps<{
    events: UserEventForMember[]
    backgroundImageUrl?: string
  }>(),
  {
    backgroundImageUrl:
      'https://cdn.pixabay.com/photo/2012/04/11/10/36/appointment-27391_960_720.png',
    events: () => [],
  }
)
</script>
<template>
  <div class="p-1">
    <div v-if="events.length === 0" class="text-gray-500">You don't have any events yet.</div>
    <div v-else class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <div
        v-for="event in events"
        :key="event.id"
        @click="router.push({ name: 'ExchangeDetails', params: { id: event.eventId } })"
        class="group cursor-pointer space-y-2 rounded-3xl border-1 border-gray-400 p-2 shadow-md shadow-gray-300 transition-colors hover:bg-gray-200"
      >
        <div
          class="aspect-square rounded-lg bg-cover bg-center"
          :style="{
            backgroundImage: `url(${backgroundImageUrl})`,
          }"
        />
        <h3 class="text-center font-medium text-gray-800 sm:text-lg">
          {{ event.eventTitle }}
        </h3>
      </div>
    </div>
  </div>
</template>
