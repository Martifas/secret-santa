<script setup lang="ts">
import Container from '@/components/Container.vue'
import { trpc } from '@/trpc'
import { useAuth0 } from '@auth0/auth0-vue'
import type { EventForMember } from '@server/entities/event'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import pic from '../assets/profile.png'
import ActionButton from '@/components/ActionButton.vue'
import { NoSymbolIcon, TrashIcon } from '@heroicons/vue/24/outline'

const { user } = useAuth0()
const route = useRoute()
const router = useRouter()
const showDeleteEventPrompt = ref(false)
const showKickMemberPrompt = ref(false)
const showLeaveEventPrompt = ref(false)
const selectedMemberToKick = ref<{ auth0Id: string | null; firstName: string | null } | null>(null)
const eventDetails = ref<EventForMember | null>(null)
const eventId = parseInt(route.params.id as string, 10)
const isValidMember = ref<boolean | null>(null)
const isCreator = ref<boolean | null>(null)
const pendingInvitations = ref<number | null>(null)
const eventMembers = ref<
  | {
      firstName: string | null
      picture: string | null
      email: string | null
      auth0Id: string | null
    }[]
  | null
>(null)

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

async function confirmDeleteEvent() {
  showDeleteEventPrompt.value = false
  await deleteEvent()
}

async function confirmKickMember() {
  if (selectedMemberToKick.value?.auth0Id) {
    await kickMember(selectedMemberToKick.value.auth0Id)
    showKickMemberPrompt.value = false
    await getEventMembers()
  }
}

async function confirmLeaveEvent(userId: string | null) {
  showLeaveEventPrompt.value = false
  await leaveEvent(userId)
}

async function getEventMembers() {
  try {
    const members = await trpc.user.getUserNamePicEmailByEvent.query({ eventId: eventId })
    eventMembers.value = members
  } catch (error) {
    console.error('Error fetching event members:', error)
    eventMembers.value = null
  }
}

async function getPendingInvitations() {
  try {
    const invitations = await trpc.invitation.getPendingInvitations.query({ eventId: eventId })
    pendingInvitations.value = invitations.length
  } catch (error) {
    console.error('Error fetching invitations:', error)
    eventMembers.value = null
  }
}

async function updateInviteesRecords() {
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

      await trpc.invitation.updateInvitation.mutate({ eventId: eventId, email: user.value.email })
    }
  } catch (error) {
    console.error('Error updating details:', error)
  }
}

async function deleteEvent() {
  try {
    await trpc.event.removeEvent.mutate({ id: eventId })
    router.push({ name: 'Dashboard' })
  } catch (error) {
    console.error('Error deleting event:', error)
  }
}

async function kickMember(userId: string | null) {
  try {
    if (!userId) {
      console.error('Cannot delete member: userId is null')
      return
    }
    await trpc.userEvent.removeMember.mutate({ userId: userId, eventId: eventId })
  } catch (error) {
    console.error('Error removing member:', error)
  }
}
async function leaveEvent(userId: string | null) {
  try {
    if (!userId) {
      console.error('Cannot delete member: userId is null')
      return
    }
    await trpc.userEvent.leaveEvent.mutate({ userId: userId, eventId: eventId })
    router.push({ name: 'Dashboard' })
  } catch (error) {
    console.error('Error leaving:', error)
  }
}

onMounted(async () => {
  await validateMember()
  if (isValidMember.value) {
    await updateInviteesRecords()
    await getEventMembers()
    await getPendingInvitations()
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
        class="border-gray-00 rounded-xl border bg-white p-6 text-center shadow-lg"
      >
        <p class="text-gray-500">Validating access...</p>
      </div>

      <!-- Event details (only shown if user is validated) -->
      <div v-else>
        <div class="mb-6 rounded-xl border-1 border-gray-200 bg-white shadow-lg">
          <div v-if="!eventDetails" class="p-6 text-center text-gray-500">No event details!</div>
          <div v-else class="flex flex-col">
            <!-- Status and Dates Row -->
            <div class="flex flex-col sm:flex-row">
              <div
                class="flex-1 border-b-1 border-gray-200 p-6 transition-colors hover:bg-gray-50 sm:border-0 sm:border-r-1"
              >
                <div class="space-y-2">
                  <h3 class="text-sm font-bold tracking-wide uppercase">Title</h3>
                  <p class="text-lg font-medium text-gray-900">{{ eventDetails.title }}</p>
                </div>
              </div>
              <!-- Draw Status -->
              <div
                class="flex-1 border-b-1 border-gray-200 p-6 transition-colors hover:bg-gray-50 sm:border-0 sm:border-r-1"
              >
                <div class="space-y-2">
                  <h3 class="text-sm font-bold tracking-wide uppercase">Your Draw</h3>
                  <p class="text-lg font-medium text-gray-900">Not Drawn Yet</p>
                </div>
              </div>

              <!-- Exchange Date -->
              <div
                class="flex-1 border-b-1 border-gray-200 p-6 transition-colors hover:bg-gray-50 sm:border-0 sm:border-r-1"
              >
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
              <div class="flex flex-col space-y-4 sm:flex-row">
                <div class="w-full">
                  <h3 class="text-sm font-bold tracking-wide uppercase">Description</h3>
                  <p class="text-gray-600">
                    {{ eventDetails.description }} - {{ user?.given_name }}
                  </p>
                </div>
                <div v-if="isCreator" class="my-auto w-full sm:w-auto">
                  <ActionButton
                    variant="danger"
                    size="sm"
                    @click="showDeleteEventPrompt = true"
                    class="w-full min-w-30 sm:w-auto"
                    >Delete Event</ActionButton
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Containers -->
        <div class="flex flex-col gap-6 md:flex-row">
          <!-- Left Container -->
          <div class="w-full md:w-1/2">
            <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
              <!-- Header -->
              <div class="border-b border-gray-200 p-6">
                <h2 class="font-bold tracking-wide text-gray-900 uppercase sm:text-lg">
                  The Guest List
                </h2>

                <!-- Stats -->
                <div class="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
                  <div class="flex space-x-1 text-gray-600">
                    <span class="my-auto text-sm text-nowrap sm:text-lg"
                      >{{ eventMembers?.length || 0 }} joined</span
                    >
                    <span class="my-auto text-sm sm:text-lg">•</span>
                    <span class="my-auto text-sm text-nowrap sm:text-lg"
                      >{{ pendingInvitations || 0 }} awaiting reply</span
                    >
                  </div>
                  <div v-if="isCreator" class="w-full sm:w-auto">
                    <ActionButton size="sm" class="w-full sm:w-auto">Invite</ActionButton>
                  </div>
                </div>
              </div>

              <!-- Members List -->
              <div class="border-b border-gray-200 p-6">
                <h3 class="text-md mb-4 font-bold tracking-wide text-gray-900 uppercase sm:text-lg">
                  Joined members
                </h3>

                <div class="space-y-3">
                  <div v-if="eventMembers" class="space-y-3">
                    <div
                      v-for="(member, index) in eventMembers"
                      :key="member.firstName || `member-${index}`"
                      class="flex items-center justify-between rounded-lg p-2 text-lg"
                    >
                      <div class="flex items-center space-x-3">
                        <img
                          :src="member.picture || pic"
                          @error="($event.target as HTMLImageElement).src = pic"
                          class="h-10 w-10 rounded-full object-cover"
                        />
                        <span class="font-medium text-gray-900">{{
                          member.firstName || 'Unknown User'
                        }}</span>
                      </div>
                      <span v-if="isCreator && member.email !== user?.email" title="kickMember">
                        <TrashIcon
                          @click="
                            () => {
                              selectedMemberToKick = member
                              showKickMemberPrompt = true
                            }
                          "
                          class="size-8 cursor-pointer text-gray-800 hover:text-red-500"
                        />
                      </span>
                      <span
                        v-else-if="!isCreator && member.email === user?.email"
                        title="Leave event"
                      >
                        <NoSymbolIcon
                          @click="showLeaveEventPrompt = true"
                          class="size-8 cursor-pointer text-gray-800 hover:text-red-500"
                        />
                      </span>
                    </div>
                  </div>
                  <div v-else class="py-4 text-center text-gray-500">Loading members...</div>
                </div>
              </div>
              <!-- Draw Status Section -->
              <div class="p-6">
                <div
                  v-if="eventMembers && eventMembers.length < 3"
                  class="rounded-lg bg-yellow-50 p-4 text-center text-yellow-700"
                >
                  <p>
                    Not enough members to start Secret Santa assignment. Need at least 3
                    participants.
                  </p>
                </div>
                <div
                  v-else-if="eventMembers && eventMembers.length >= 3"
                  class="flex w-full justify-center sm:w-auto"
                >
                  <ActionButton size="sm" class="w-full sm:w-auto">
                    Draw Names for Secret Santa
                  </ActionButton>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Container -->
          <div class="w-full md:w-1/2">
            <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
              <!-- Your Wishlist Section -->
              <div class="border-b border-gray-200 p-6">
                <h2 class="mb-4 font-bold tracking-wide text-gray-900 uppercase sm:text-lg">
                  Your Wishlist
                </h2>
                <div class="space-y-4">
                  <div class="flex flex-col space-y-2">
                    <label for="wishlist-select" class="text-sm font-medium text-gray-700"
                      >Select Wishlist</label
                    >
                    <select
                      id="wishlist-select"
                      class="rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Select a wishlist...</option>
                    </select>
                  </div>
                  <div class="flex flex-row justify-between space-y-2">
                    <h3 class="text-md font-medium text-gray-700">Wishlist for this event:</h3>
                    <p class="text-gray-600">No wishlist selected</p>
                  </div>
                  <div class="flex justify-end pt-2">
                    <ActionButton
                      @click="router.push({ name: 'Wishlist' })"
                      size="sm"
                      class="w-full sm:w-auto"
                      >Create New Wishlist</ActionButton
                    >
                  </div>
                </div>
              </div>

              <!-- Your Draw Wishlist Section -->
              <div class="p-6">
                <h2 class="mb-4 font-bold tracking-wide text-gray-900 uppercase sm:text-lg">
                  Your Draw Wishlist
                </h2>
                <div class="rounded-lg bg-gray-50 p-4 text-center text-gray-600">
                  <p>No wishlist available yet</p>
                  <p class="text-sm">Wishlists will be revealed after the draw</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Delete Event Confirmation -->
    <Teleport to="body">
      <div
        v-if="showDeleteEventPrompt"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      >
        <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
          <h3 class="mb-4 text-lg font-semibold">Delete Event</h3>
          <p class="mb-6 text-gray-600">
            Are you sure you want to delete this event? This action cannot be undone.
          </p>
          <div class="flex justify-end space-x-3">
            <button
              @click="showDeleteEventPrompt = false"
              class="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              @click="confirmDeleteEvent"
              class="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Kick Member Confirmation -->
    <Teleport to="body">
      <div
        v-if="showKickMemberPrompt"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      >
        <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
          <h3 class="mb-4 text-lg font-semibold">Remove Member</h3>
          <p class="mb-6 text-gray-600">
            Are you sure you want to remove {{ selectedMemberToKick?.firstName }} from this event?
          </p>
          <div class="flex justify-end space-x-3">
            <button
              @click="showKickMemberPrompt = false"
              class="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              @click="confirmKickMember"
              class="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Leave Event Confirmation -->
    <Teleport to="body">
      <div
        v-if="showLeaveEventPrompt"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      >
        <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
          <h3 class="mb-4 text-lg font-semibold">Leave Event</h3>
          <p class="mb-6 text-gray-600">Are you sure you want to leave this event?</p>
          <div class="flex justify-end space-x-3">
            <button
              @click="showLeaveEventPrompt = false"
              class="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              @click="confirmLeaveEvent(user?.sub ?? null)"
              class="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Leave
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </Container>
</template>
