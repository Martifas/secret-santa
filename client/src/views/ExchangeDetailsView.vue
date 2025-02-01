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
const eventId = parseInt(route.params.id as string, 10)
const isValidMember = ref<boolean | null>(null)
const isCreator = ref<boolean | null>(null)

async function validateMember() {
  try {
    if (!user.value?.sub || !user.value.email) {
      console.error('User not authenticated')
      isValidMember.value = false
      isCreator.value = false
      return
    }

    const event = await trpc.event.getEvent.query({ id: eventId })
    eventDetails.value = event ?? null

    if (event.createdBy === user.value.sub) {
      isValidMember.value = true
      isCreator.value = true
      return
    } else {
      isCreator.value = false
    }

    const validation = await trpc.invitation.getInvitation.query({
      eventId: eventId,
      email: user.value.email,
    })
    isValidMember.value = !!validation
  } catch (error) {
    console.error('Validation error:', error)
    isValidMember.value = false
    isCreator.value = false
  }
}

async function updateInviteesUserEvent() {
  try {
    if (!user.value?.sub || !user.value.email) {
      console.error('User not authenticated')
      return
    }

    if (isValidMember.value && !isCreator.value && eventDetails.value) {
      await trpc.userEvent.createUserEvent.mutate({
        userId: user.value.sub,
        eventId: eventId,
        eventTitle: eventDetails.value.title,
        role: 'member',
      })
    }
  } catch (error) {
    console.error('Error creating user event:', error)
  }
}

onMounted(async () => {
  await validateMember()
  if (isValidMember.value) {
    await updateInviteesUserEvent()
  }
})
</script>

<template>
  <Container>
    <div class="min-h-screen p-4">
      <!-- Not a member message -->
      <div
        v-if="isValidMember === false"
        class="rounded-xl border border-red-200 bg-white p-6 text-center shadow-lg"
      >
        <h2 class="mb-2 text-xl font-semibold text-red-600">Access Denied</h2>
        <p class="text-gray-600">Sorry, you are not a member of this event.</p>
      </div>

      <!-- Loading state -->
      <div
        v-else-if="isValidMember === null"
        class="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-lg"
      >
        <p class="text-gray-500">Validating access...</p>
      </div>

      <!-- Event details (only shown if user is validated) -->
      <div v-else>
        <div class="mb-6 rounded-xl border border-gray-200 bg-white shadow-lg">
          <div v-if="!eventDetails" class="p-6 text-center text-gray-500">No event details!</div>
          <div v-else class="flex flex-col">
            <!-- Status and Dates Row -->
            <div
              class="flex flex-col divide-y divide-gray-200 md:flex-row md:divide-x md:divide-y-0"
            >
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
    </div>
  </Container>
</template>
