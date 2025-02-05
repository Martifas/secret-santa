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
import { TrashIcon } from '@heroicons/vue/24/outline'
import pic from '../assets/profile.png'
import { trpc } from '@/trpc'
import { useSanteeStore } from '@/stores/santeeStore'
import { useGiftRecommendation } from '@/composables/useGiftRecommendation'
import InsctructionsContainer from '@/components/InsctructionsContainer.vue'

const { user } = useAuth0()
const route = useRoute()
const router = useRouter()
const eventId = parseInt(route.params.id as string, 10)
const santeeStore = useSanteeStore()

const showInvitePopup = ref(false)
const inviteEmail = ref('')
const santeeWishlistTitle = ref<string>('')
const santeeWishlistId = ref<number>(0)
const successMessage = ref('')

const errorMessages = ref({
  kick: '',
  delete: '',
  draw: '',
  invite: '',
})

const {
  showGiftPrompt,
  interest,
  errorMessage,
  recommendation,
  isLoading,
  openGiftPrompt,
  closeGiftPrompt,
  getGiftRecommendation,
} = useGiftRecommendation()

const {
  eventDetails,
  isValidMember,
  isCreator,
  secretSantaAssignmentName,
  secretSantaAssignmentId,
  validateMember,
  drawSecretSantas,
  getSecretSantaAssignment,
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
} = useWishlist(eventId, user.value?.sub)

const {
  eventMembers,
  selectedMemberToKick,
  pendingInvitations,
  getEventMembers,
  getPendingInvitations,
} = useEventMembers(eventId)

async function handleDrawButtonClick() {
  if (secretSantaAssignmentName.value) {
    openModal('redraw')
  } else {
    openModal('draw')
  }
}

async function confirmDrawNames() {
  try {
    closeModal('draw')
    const result = await drawSecretSantas()
    if (result) {
      await getSecretSantaAssignment()
      errorMessages.value.draw = ''
      successMessage.value = `${result.message} and emails were sent successfully!`
      setTimeout(() => {
        successMessage.value = ''
      }, 5000)
    }
  } catch (error) {
    errorMessages.value.draw = 'Failed to draw names. Please try again.'
  }
}

async function confirmReDrawNames() {
  try {
    closeModal('redraw')
    const result = await drawSecretSantas()
    if (result) {
      await getSecretSantaAssignment()
      errorMessages.value.draw = ''
      successMessage.value = `${result.message} and emails were sent successfully!`
      setTimeout(() => {
        successMessage.value = ''
      }, 5000)
    }
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

async function getSanteeWishlist() {
  if (!secretSantaAssignmentId?.value) {
    return
  }

  try {
    santeeStore.setSanteeDetails(secretSantaAssignmentId.value)
    const userEvent = await trpc.userEvent.getUserEvent.query({
      eventId,
      userId: secretSantaAssignmentId.value,
    })

    if (userEvent?.wishlistId) {
      const wishlist = await trpc.userWishlist.getUserWishlist.query({ id: userEvent.wishlistId })
      if (wishlist) {
        santeeWishlistTitle.value = wishlist.title
        santeeWishlistId.value = userEvent.wishlistId
      }
    }
  } catch (error) {
    console.error('Error fetching santee wishlist:', error)
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
      getSecretSantaAssignment(),
      updateInviteesRecords(),
      getEventMembers(),
      getPendingInvitations(),
      getUserWishlists(),
      getInitialWishlist(),
    ])

    await getSanteeWishlist()
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
                  <div v-if="secretSantaAssignmentName">{{ secretSantaAssignmentName }}</div>
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
                    isCreator &&
                    eventMembers &&
                    eventMembers.length >= 3 &&
                    !secretSantaAssignmentName
                  "
                  class="flex w-full justify-center sm:w-auto"
                >
                  <ActionButton @click="handleDrawButtonClick" size="sm" class="w-full sm:w-auto">
                    Draw Names for Secret Santa
                  </ActionButton>
                </div>
                <div
                  v-else-if="
                    isCreator &&
                    eventMembers &&
                    eventMembers.length >= 3 &&
                    secretSantaAssignmentName
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
              <!-- Success Message -->
              <div
                v-if="successMessage"
                class="mt-4 rounded-lg bg-green-50 p-4 text-center text-green-700 transition-opacity duration-500"
              >
                {{ successMessage }}
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
                <div class="space-y-4">
                  <div class="flex flex-col space-y-4">
                    <div class="flex justify-center gap-10 pt-3">
                      <h3 class="text-md font-medium text-gray-700">Wishlist for this event:</h3>
                      <p class="pr-1 text-gray-600">
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
              <div class="border-b border-gray-200 p-6">
                <h2 class="mb-4 font-bold tracking-wide text-gray-900 uppercase sm:text-lg">
                  Your Draw Wishlist
                </h2>
                <div class="space-y-4">
                  <div class="flex flex-col space-y-4">
                    <div class="flex justify-center gap-10 pt-3">
                      <h3 class="text-md font-medium text-gray-700">
                        {{ secretSantaAssignmentName }}'s' wishlist for this event:
                      </h3>
                      <p class="text-gray-600">
                        {{ santeeWishlistTitle || 'No wishlist selected' }}
                      </p>
                    </div>

                    <div class="flex justify-around space-x-4">
                      <ActionButton
                        variant="information"
                        v-if="santeeWishlistId"
                        @click="
                          router.push({
                            name: 'WishlistDetailed',
                            params: { id: santeeWishlistId },
                          })
                        "
                        class="w-full sm:w-auto"
                        size="sm"
                      >
                        View Selected Wishlist
                      </ActionButton>
                      <ActionButton variant="primary" size="sm" @click="openGiftPrompt"
                        >Gift recommendation</ActionButton
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <InsctructionsContainer>
          <div>
            <h2 className="text-xl font-bold">Welcome to Your Secret Santa Event!</h2>
            <p className="py-2">
              Welcome to your personalized Secret Santa dashboard! This space is designed to help
              you manage your gift-giving experience while keeping the holiday spirit alive. Whether
              you're an organizer or participant, you'll find everything you need to make this
              exchange memorable.
            </p>
          </div>
          <div>
            <h2 className="pt-7 text-xl font-bold">Event Details & Navigation</h2>
            <p className="py-2">
              The dashboard provides comprehensive information about your Secret Santa event. Take a
              moment to familiarize yourself with these key features:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <b>Event Information:</b> View important details like exchange date, budget limit,
                and event description.
              </li>
              <li><b>Guest List:</b> See all participants and their status in the event.</li>
              <li>
                <b>Your Assignment:</b> Once names are drawn, you'll see your giftee's name here.
              </li>
              <li>
                <b>Wishlist Management:</b> Create and manage your own wishlist, and view your
                giftee's when available.
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mt-7 text-xl font-bold">Creating Your Wishlist</h2>
            <p className="py-2">
              Make it easier for your Secret Santa by creating a detailed wishlist. Here are some
              tips for an effective wishlist:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <b>Be Specific:</b> Include details about colors, sizes, or specific models you
                prefer.
              </li>
              <li>
                <b>Price Range:</b> Add items at various price points within the budget limit.
              </li>
              <li>
                <b>Multiple Options:</b> Give your Secret Santa choices by listing several items.
              </li>
              <li><b>Keep it Updated:</b> Regularly review and update your wishlist as needed.</li>
            </ul>
          </div>
          <div>
            <h2 className="mt-7 text-xl font-bold">For Event Organizers</h2>
            <p className="py-2">
              If you're the event organizer, you have additional responsibilities and features
              available:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li><b>Participant Management:</b> Invite new members and manage the guest list.</li>
              <li><b>Name Drawing:</b> Initiate the Secret Santa draw when ready.</li>
              <li><b>Support:</b> Assist participants with any questions or concerns.</li>
            </ul>
          </div>
          <div>
            <h2 className="mt-7 text-xl font-bold">Gift Recommendations</h2>
            <p className="py-2">Need inspiration for your gift? Try these approaches:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <b>Use Recommendations:</b> Click the 'Gift recommendation' button to get
                personalized suggestions.
              </li>
              <li>
                <b>Consider Interests:</b> Look at your giftee's wishlist for clues about their
                preferences.
              </li>
              <li>
                <b>Think Creative:</b> Sometimes the best gifts are thoughtful rather than
                expensive.
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mt-7 text-xl font-bold">Important Reminders</h2>
            <p className="py-2">
              Keep these key points in mind for a successful Secret Santa experience:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <b>Deadlines:</b> Pay attention to the exchange date and ensure your gift is ready
                on time.
              </li>
              <li><b>Budget:</b> Stick to the specified budget limit for fairness.</li>
              <li>
                <b>Privacy:</b> Maintain the surprise by keeping your giftee assignment
                confidential.
              </li>
              <li>
                <b>Communication:</b> Use the event organizer as a point of contact if needed.
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mt-7 text-xl font-bold">Technical Support</h2>
            <p className="py-2">Encountering issues with the platform? Here's what you can do:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li><b>Check Access:</b> Ensure you're properly logged in to view all features.</li>
              <li><b>Refresh Data:</b> Try refreshing the page if information seems outdated.</li>
              <li>
                <b>Contact Support:</b> Reach out to the event organizer for assistance with
                technical issues.
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mt-7 text-xl font-bold">Need Help?</h2>
            <p className="py-2">
              If you have any questions about the event, technical issues, or need assistance, don't
              hesitate to contact the event organizer. They're here to ensure everyone has a great
              Secret Santa experience!
            </p>
          </div>
        </InsctructionsContainer>
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
    <Teleport to="body">
      <div
        v-if="showGiftPrompt"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      >
        <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
          <h3 class="mb-4 text-lg font-semibold">Get Gift Recommendation</h3>

          <div class="mb-4">
            <label for="interest" class="mb-2 block text-sm font-medium text-gray-700">
              What are their interests?
            </label>
            <input
              id="interest"
              type="text"
              v-model="interest"
              class="w-full rounded-lg border border-gray-300 p-2"
              placeholder="Enter an interest (e.g., racing, cooking)"
            />
            <p v-if="errorMessage" class="mt-2 text-sm text-red-600">
              {{ errorMessage }}
            </p>
          </div>

          <div v-if="recommendation" class="mb-4 rounded-lg bg-gray-50 p-4">
            <h4 class="font-medium text-gray-900">Recommendation:</h4>
            <p class="mt-2 text-gray-600">{{ recommendation.gift }}</p>
            <p class="mt-1 text-sm text-gray-500">
              Price Range: {{ recommendation['price range'] }}
            </p>
          </div>

          <div class="flex justify-end space-x-3">
            <ActionButton @click="closeGiftPrompt" variant="secondary">
              {{ recommendation ? 'Close' : 'Cancel' }}
            </ActionButton>
            <ActionButton
              v-if="!recommendation"
              @click="getGiftRecommendation(`€${eventDetails?.budgetLimit}`)"
              variant="information"
              :disabled="isLoading"
            >
              {{ isLoading ? 'Loading...' : 'Submit' }}
            </ActionButton>
          </div>
        </div>
      </div>
    </Teleport>
  </Container>
</template>
