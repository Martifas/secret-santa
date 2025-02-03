<script setup lang="ts">
import Container from '@/components/Container.vue'
import ActionButton from '@/components/ActionButton.vue'
import { useModalStates } from '@/composables/useModalStates'
import { useWishlist } from '@/composables/useWishlist'
import { useEventMembers } from '@/composables/useEventMembers'
import { useEventManagement } from '@/composables/useEventManagement'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import { NoSymbolIcon, TrashIcon } from '@heroicons/vue/24/outline'
import pic from '../assets/profile.png'
import { trpc } from '@/trpc'

const { user } = useAuth0()
const route = useRoute()
const router = useRouter()
const eventId = parseInt(route.params.id as string, 10)

const showInvitePopup = ref(false)
const inviteEmail = ref('')

const errorMessages = ref({
  kick: '',
  delete: '',
  draw: '',
  invite: '',
})

const {
  eventDetails,
  isValidMember,
  isCreator,
  secretSantaName,
  validateMember,
  drawSecretSantas,
  getSecretSanta,
  deleteEvent,
  updateInviteesRecords,
} = useEventManagement(eventId)

const {
  showDrawNamesPrompt,
  showReDrawNamesPrompt,
  showDeleteEventPrompt,
  showKickMemberPrompt,
  openModal,
  closeModal,
} = useModalStates()

const {
  userWishlists,
  selectedWishlistTitle,
  currentWishlistId,
  getUserWishlists,
  getInitialWishlist,
} = useWishlist(eventId)

const {
  eventMembers,
  selectedMemberToKick,
  pendingInvitations,
  getEventMembers,
  getPendingInvitations,
} = useEventMembers(eventId)

async function handleDrawButtonClick() {
  if (secretSantaName.value) {
    openModal('redraw')
  } else {
    openModal('draw')
  }
}

async function confirmDrawNames() {
  try {
    closeModal('draw')
    await drawSecretSantas()
    await getSecretSanta()
    errorMessages.value.draw = ''
  } catch (error) {
    errorMessages.value.draw = 'Failed to draw names. Please try again.'
  }
}

async function confirmReDrawNames() {
  try {
    closeModal('redraw')
    await drawSecretSantas()
    await getSecretSanta()
    errorMessages.value.draw = ''
  } catch (error) {
    errorMessages.value.draw = 'Failed to redraw names. Please try again.'
  }
}

async function confirmDeleteEvent() {
  try {
    closeModal('delete')
    const success = await deleteEvent()
    if (success) {
      errorMessages.value.delete = ''
      router.push({ name: 'Dashboard' })
    }
  } catch (error) {
    errorMessages.value.delete = 'Failed to delete event. Please try again.'
  }
}

async function confirmKickMember() {
  if (selectedMemberToKick.value?.auth0Id) {
    await kickMember(selectedMemberToKick.value.auth0Id)
    closeModal('kick')
    await getEventMembers()
  }
}



async function kickMember(userId: string | null) {
  try {
    if (!userId) {
      errorMessages.value.kick = 'Cannot remove member: Invalid user'
      return
    }
    await trpc.userEvent.removeMember.mutate({ userId, eventId })
    errorMessages.value.kick = ''
  } catch (error) {
    errorMessages.value.kick = 'Failed to remove member. Please try again.'
  }
}



async function sendInvitations(email: string) {
  try {
    const eventDetails = await trpc.event.getEvent.query({ id: eventId })
    const creator = eventMembers.value?.find((member) => member.auth0Id === eventDetails.createdBy)

    await trpc.invitation.createAndSendInvitation.mutate({
      email: email,
      eventId: eventId,
      status: 'sent',
      eventOrganiser: creator?.firstName || 'Event Organizer',
      eventDate: eventDetails.eventDate,
      title: eventDetails.title,
      budgetLimit: eventDetails.budgetLimit,
      description: eventDetails.description,
    })

    showInvitePopup.value = false
    inviteEmail.value = ''
    errorMessages.value.invite = ''
    await getPendingInvitations()
  } catch (error) {
    errorMessages.value.invite = 'Failed to send invitation. Please try again.'
  }
}

onMounted(async () => {
  await validateMember()
  if (isValidMember.value) {
    await Promise.all([
      updateInviteesRecords(),
      getEventMembers(),
      getPendingInvitations(),
      getUserWishlists(),
      getInitialWishlist(),
      getSecretSanta(),
    ])
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
                  <div v-if="secretSantaName">{{ secretSantaName }}</div>
                  <div v-else><p class="text-lg font-medium text-gray-900">Not Drawn Yet</p></div>
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
                    <ActionButton
                      size="sm"
                      class="w-full sm:w-auto"
                      @click="showInvitePopup = true"
                    >
                      Invite
                    </ActionButton>
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
                  v-else-if="
                    isCreator && eventMembers && eventMembers.length >= 3 && !secretSantaName
                  "
                  class="flex w-full justify-center sm:w-auto"
                >
                  <ActionButton @click="handleDrawButtonClick" size="sm" class="w-full sm:w-auto">
                    Draw Names for Secret Santa
                  </ActionButton>
                </div>
                <div
                  v-else-if="
                    isCreator && eventMembers && eventMembers.length >= 3 && secretSantaName
                  "
                  class="flex w-full justify-center sm:w-auto"
                >
                  <ActionButton @click="handleDrawButtonClick" size="sm" class="w-full sm:w-auto">
                    Re-Draw Names for Secret Santa
                  </ActionButton>
                </div>
                <div
                  v-else-if="!isCreator && eventMembers && eventMembers.length >= 3"
                  class="flex w-full justify-center sm:w-auto"
                >
                  Get ready for secret santa assignment!
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
                      v-model="selectedWishlistTitle"
                      class="rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Select a wishlist...</option>
                      <option
                        v-for="wishlist in userWishlists"
                        :key="wishlist.title"
                        :value="wishlist.title"
                      >
                        {{ wishlist.title }}
                      </option>
                    </select>
                  </div>
                  <div class="flex flex-col space-y-4">
                    <div class="flex justify-between">
                      <h3 class="text-md font-medium text-gray-700">Wishlist for this event:</h3>
                      <p class="text-gray-600">
                        {{ selectedWishlistTitle || 'No wishlist selected' }}
                      </p>
                    </div>

                    <div class="flex justify-around space-x-4">
                      <ActionButton
                        variant="information"
                        v-if="currentWishlistId"
                        @click="
                          router.push({
                            name: 'WishlistItems',
                            params: { id: currentWishlistId },
                          })
                        "
                        class="w-full sm:w-auto"
                        size="sm"
                      >
                        View Selected Wishlist
                      </ActionButton>
                      <ActionButton
                        @click="router.push({ name: 'Wishlist' })"
                        size="sm"
                        class="w-full sm:w-auto"
                      >
                        Create New Wishlist
                      </ActionButton>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Draw Wishlist Section -->
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
          <p v-if="errorMessages.delete" class="mb-4 text-sm text-red-600">
            {{ errorMessages.delete }}
          </p>
          <div class="flex justify-end space-x-3">
            <ActionButton @click="showDeleteEventPrompt = false" variant="secondary">
              Cancel
            </ActionButton>
            <ActionButton @click="confirmDeleteEvent" variant="danger"> Delete </ActionButton>
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
          <p v-if="errorMessages.kick" class="mb-4 text-sm text-red-600">
            {{ errorMessages.kick }}
          </p>
          <div class="flex justify-end space-x-3">
            <ActionButton @click="showKickMemberPrompt = false" variant="secondary">
              Cancel
            </ActionButton>
            <ActionButton @click="confirmKickMember" variant="danger"> Remove </ActionButton>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Draw Names Confirmation -->
    <Teleport to="body">
      <div
        v-if="showDrawNamesPrompt"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      >
        <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
          <h3 class="mb-4 text-lg font-semibold">Draw Names for Secret Santa</h3>
          <p class="mb-6 text-gray-600">
            Are you sure you want to proceed with the Secret Santa draw? This will assign each
            participant their gift recipient.
          </p>
          <p v-if="errorMessages.draw" class="mb-4 text-sm text-red-600">
            {{ errorMessages.draw }}
          </p>
          <div class="flex justify-end space-x-3">
            <ActionButton @click="showDrawNamesPrompt = false" variant="secondary">
              Cancel
            </ActionButton>
            <ActionButton @click="confirmDrawNames" variant="primary"> Draw Names </ActionButton>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Re-Draw Names Confirmation -->
    <Teleport to="body">
      <div
        v-if="showReDrawNamesPrompt"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      >
        <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
          <h3 class="mb-4 text-lg font-semibold">Re-Draw Names for Secret Santa</h3>
          <p class="mb-6 text-gray-600">
            Are you sure you want to re-draw the Secret Santa assignments? This will reset all
            current assignments and create new ones.
          </p>
          <div class="flex justify-end space-x-3">
            <ActionButton variant="secondary" @click="showReDrawNamesPrompt = false">
              Cancel
            </ActionButton>
            <ActionButton variant="primary" @click="confirmReDrawNames">
              Re-Draw Names
            </ActionButton>
          </div>
        </div>
      </div>
    </Teleport>
    <!--Invite Popup -->
    <Teleport to="body">
      <div
        v-if="showInvitePopup"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      >
        <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
          <div class="mb-4">
            <input
              type="email"
              v-model="inviteEmail"
              class="w-full rounded-lg border border-gray-300 p-2"
              placeholder="Enter email address"
            />
            <p v-if="errorMessages.invite" class="mt-2 text-sm text-red-600">
              {{ errorMessages.invite }}
            </p>
          </div>
          <div class="flex justify-end space-x-3">
            <ActionButton @click="showInvitePopup = false" variant="secondary">
              Cancel
            </ActionButton>
            <ActionButton @click="sendInvitations(inviteEmail)" variant="information">
              Send
            </ActionButton>
          </div>
        </div>
      </div>
    </Teleport>
  </Container>
</template>
