<script setup lang="ts">
import Container from '@/components/Container.vue'
import { trpc } from '@/trpc'
import { useAuth0 } from '@auth0/auth0-vue'
import type { EventForMember } from '@server/entities/event'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const { user } = useAuth0()
const route = useRoute()

const eventDetails = ref<EventForMember | null>(null)

async function loadEventDetails() {
  try {
    if (!user.value?.sub) {
      console.error('User not authenticated')
      return
    }

    const eventId = parseInt(route.params.id as string, 10)

    if (isNaN(eventId)) {
      throw new Error('Invalid event ID')
    }

    const event = await trpc.event.getEvent.query({ id: eventId })

    eventDetails.value = event ?? null
  } catch (error) {}
}

onMounted(() => {
  loadEventDetails()
})
</script>
<template>
  <Container>
    <div class="min-h-screen p-4">
      <!-- Top Container -->
      <div class="mb-6 rounded-xl border border-gray-200 bg-white shadow-lg">
        <div v-if="!eventDetails" class="p-6 text-center text-gray-500">No event details!</div>
        <div v-else class="flex flex-col">
          <!-- Status and Dates Row -->
          <div class="flex flex-col divide-y divide-gray-200 md:flex-row md:divide-x md:divide-y-0">
            <!-- Draw Status -->
            <div class="flex-1 p-6 transition-colors hover:bg-gray-50">
              <div class="space-y-2">
                <h3 class="text-sm font-bold tracking-wide uppercase">Your Draw</h3>
                <p class="text-lg font-medium text-gray-900">Not Drawn Yet</p>
              </div>
            </div>
            <!-- Exchange Date -->
            <div class="flex-1 p-6 transition-colors hover:bg-gray-50">
              <div class="space-y-2">
                <h3 class="text-sm font-bold tracking-wide uppercase">Exchange Date</h3>
                <p class="text-lg font-medium text-gray-900">
                  {{
                    new Date(eventDetails.eventDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  }}
                </p>
              </div>
            </div>
            <!-- Gift Budget -->
            <div class="flex-1 p-6 transition-colors hover:bg-gray-50">
              <div class="space-y-2">
                <h3 class="text-sm font-bold tracking-wide uppercase">Gift Budget</h3>
                <p class="text-lg font-medium text-gray-900">{{ eventDetails.budgetLimit }}</p>
              </div>
            </div>
          </div>
          <!-- Message Box -->
          <div class="border-t border-gray-200 p-6">
            <p class="text-base text-gray-600">
              {{ eventDetails.description }} - {{ user?.given_name }}
            </p>
          </div>
        </div>
      </div>

      <!-- Bottom Containers -->
      <div class="flex flex-col gap-6 md:flex-row">
        <!-- Left Container -->
        <div class="w-full md:w-1/2">
          <div class="flex h-64 items-center justify-center rounded-lg bg-gray-100">
            <p class="text-gray-500">Left Container Content</p>
          </div>
        </div>
        <!-- Right Container -->
        <div class="w-full md:w-1/2">
          <div class="flex h-64 items-center justify-center rounded-lg bg-gray-100">
            <p class="text-gray-500">Right Container Content</p>
          </div>
        </div>
      </div>
    </div>
  </Container>
</template>
