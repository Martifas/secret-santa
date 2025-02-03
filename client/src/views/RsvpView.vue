<script setup lang="ts">
import ActionButton from '@/components/ActionButton.vue'
import { trpc } from '@/trpc'
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import InsctructionsContainer from '@/components/InsctructionsContainer.vue'

const props = defineProps<{
  id: number
  response: 'accept' | 'refuse'
  eventId: number
}>()

const route = useRoute()
const router = useRouter()
const isLoading = ref(false)
const error = ref<Error | null>(null)
const invitationId = parseInt(route.params.id as string, 10)

async function setStatus(status: string) {
  try {
    await trpc.invitation.updateInvitationStatus.mutate({
      id: invitationId,
      status: status,
    })
  } catch (err) {
    throw new Error(`Failed to set status: ${err instanceof Error ? err.message : String(err)}`)
  }
}

async function deleteDeclinedInvitation(invitationId: number) {
  try {
    await trpc.invitation.deleteInvitation.mutate({ id: invitationId })
  } catch (err) {
    throw new Error(
      `Failed to delete invitation: ${err instanceof Error ? err.message : String(err)}`
    )
  }
}

async function updateUserInvitationStatus(status: string) {
  if (isLoading.value) return

  isLoading.value = true
  error.value = null

  try {
    await setStatus(status)
    await router.push({
      name: 'ExchangeDetails',
      params: { id: props.eventId },
    })
  } catch (err) {
    error.value = err instanceof Error ? err : new Error('Failed to update invitation status')
    console.error('Failed to update invitation status:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  if (props.response === 'refuse') {
    await setStatus('declined')
    await deleteDeclinedInvitation(invitationId)
  }
})
</script>

<template>
  <div class="flex justify-around p-6">
    <div v-if="error" class="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
      {{ error.message }}
    </div>

    <div v-if="response === 'accept'" class="max-w-4xl text-center">
      <p class="mb-4 text-3xl font-bold">Welcome to the Gift Exchange!</p>
      <div class="flex justify-center">
        <ActionButton :disabled="isLoading" @click="updateUserInvitationStatus('accepted')">
          {{ isLoading ? 'Processing...' : 'Take me to the event!' }}
        </ActionButton>
      </div>
      <InsctructionsContainer class="text-start">
        <div class="text-start">
          <h2 className="text-xl font-bold">Welcome to Your Secret Santa Adventure!</h2>
          <p className="py-2">
            You're about to join a magical gift exchange experience. Before you proceed, here's what
            you can expect in your Secret Santa journey.
          </p>
        </div>

        <div>
          <h2 className="pt-7 text-xl font-bold">What Happens Next</h2>
          <p className="py-2">
            Once you click the button above, you'll be taken to your event dashboard where you can:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li><b>Set Up Your Profile:</b> Help others get to know you better</li>
            <li><b>Create Your Wishlist:</b> Share gift ideas that you'd love to receive</li>
            <li><b>View Event Details:</b> See important dates, budget, and other participants</li>
            <li><b>Wait for the Draw:</b> The event organizer will assign Secret Santas soon!</li>
          </ul>
        </div>

        <div>
          <h2 className="mt-7 text-xl font-bold">Getting Ready</h2>
          <p className="py-2">
            Here are some tips to make the most of your Secret Santa experience:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li><b>Check Your Calendar:</b> Mark the exchange date and set reminders</li>
            <li>
              <b>Note the Budget:</b> Keep the specified budget in mind when creating your wishlist
            </li>
            <li>
              <b>Think About Interests:</b> Start considering what kinds of gifts you'd like to
              receive
            </li>
            <li>
              <b>Stay Active:</b> Regular visits to the platform ensure you don't miss any updates
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mt-7 text-xl font-bold">Creating Your First Wishlist</h2>
          <p className="py-2">
            After joining, you'll want to create your wishlist. Here are some suggestions:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <b>Variety is Key:</b> Include items at different price points within the budget
            </li>
            <li>
              <b>Be Specific:</b> Add details about colors, sizes, or specific models you prefer
            </li>
            <li><b>Include Links:</b> Share links to specific items when possible</li>
            <li><b>Add Alternatives:</b> Give your Secret Santa multiple options to choose from</li>
          </ul>
        </div>

        <div>
          <h2 className="mt-7 text-xl font-bold">The Secret Santa Code</h2>
          <p className="py-2">
            Remember these golden rules for a successful Secret Santa experience:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li><b>Keep the Secret:</b> Don't reveal who you're buying for</li>
            <li><b>Stay Within Budget:</b> Respect the set budget limits</li>
            <li><b>Be Thoughtful:</b> Put care into selecting your gift</li>
            <li><b>Have Fun:</b> Enjoy the mystery and excitement of Secret Santa!</li>
          </ul>
        </div>

        <div>
          <h2 className="mt-7 text-xl font-bold">Ready to Begin?</h2>
          <p className="py-2">
            Click the "Take me to the event!" button above to start your Secret Santa adventure. The
            event organizer and platform are here to help if you need any assistance along the way.
            Let the gift-giving journey begin!
          </p>
        </div>
      </InsctructionsContainer>
    </div>

    <div v-else class="max-w-4xl">
      <div class="mb-12 text-center">
        <p class="mb-4 justify-center text-3xl">Thanks for letting us know!</p>
        <p class="mb-6">
          While you can't join this time, here are some other ways to join the fun:
        </p>
        <div class="mb-8 flex flex-col items-center gap-4">
          <button
            :disabled="isLoading"
            class="w-sm rounded-lg bg-green-900 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50 sm:w-lg"
          >
            Create Your Own Gift Exchange
          </button>
          <button
            :disabled="isLoading"
            class="w-sm rounded-lg bg-green-900 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50 sm:w-lg"
          >
            Start Your Wishlist
          </button>
        </div>
      </div>

      <div class="mt-8 rounded-lg border border-gray-300 p-8">
        <div>
          <h2 class="text-xl font-bold">Start Your Own Gift Exchange</h2>
          <p class="py-2">
            Can't make it to this one? Why not organize your own gift exchange at a time that works
            for you? It's a great way to bring friends and family together!
          </p>
        </div>

        <div>
          <h2 class="pt-7 pb-2 text-xl font-bold">Easy Steps to Get Started</h2>
          <ul class="list-disc space-y-2 pl-5">
            <li><b>Pick a date:</b> Choose a time that works best for your group</li>
            <li><b>Invite your people:</b> We'll help you send out invitations</li>
            <li><b>Let the matching begin:</b> We'll handle the random assignments</li>
          </ul>
        </div>

        <div>
          <h2 class="mt-7 pb-2 text-xl font-bold">Or Create a Wishlist Instead</h2>
          <p class="py-2">
            Not ready to organize but want to join the gift-giving spirit? Start by creating your
            wishlist:
          </p>
          <ul class="list-disc space-y-2 pl-5">
            <li><b>Share your interests:</b> Let others know what you'd love to receive</li>
            <li><b>Make gift-giving easier:</b> Help friends and family choose the perfect gift</li>
            <li><b>Stay organized:</b> Keep track of gift ideas year-round</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
