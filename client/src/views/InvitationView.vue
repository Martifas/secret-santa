<script setup lang="ts">
import { trpc } from '@/trpc'
import { PlusIcon, TrashIcon, EnvelopeIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const participants = ref([{ email: '' }, { emaiL: '' }, { email: '' }])
const addParticipant = () => {
  participants.value.push({ email: '' })
}

const removeParticipant = (index: number) => {
  participants.value = participants.value.filter((_, i) => i !== index)
}

async function sendInvitations() {
  try {
    if (participants.value.length < 3) {
      throw new Error('Not enough participants. Atleast 3 are required')
    }

    const eventId = parseInt(route.params.id as string, 10)

    if (isNaN(eventId)) {
      throw new Error('Invalid event ID')
    }

    // Use for...of to iterate over array elements
    for (const participant of participants.value) {
      if (!participant.email) {
        continue // Skip empty email entries
      }

      await trpc.invitation.createInvitation.mutate({
        email: participant.email,
        eventId: eventId,
        status: 'sent'
      })
    }
  } catch (error) {}
}
</script>

<template>
  <div class="container mx-auto max-w-7xl px-4 pt-8">
    <div class="mt-7 flex gap-6">
      <div class="relative hidden h-[600px] basis-1/2 md:block">
        <img
          class="h-full w-full max-w-[500px] overflow-hidden rounded-lg object-cover object-center"
          src="https://images.unsplash.com/photo-1639562954924-1928f7cda17c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Pile of gifts"
        />
      </div>
      <div class="basis-full md:basis-1/2">
        <div class="mb-8">
          <h2 class="mb-4 text-3xl font-bold">Invite your friends</h2>
          <p class="text-gray-600">Share your gift exhange event with your friends</p>
        </div>
        <form class="mx-auto w-auto">
          <div
            class="mx-auto my-2 flex flex-row gap-2"
            v-for="(participant, index) in participants"
            :key="index"
          >
            <div class="w-full">
              <label for="participant" class="mb-2 block text-sm font-medium text-gray-900"></label>
              <input
                type="email"
                id="participant"
                v-model="participant.email"
                :placeholder="`Friend's ${index + 1} email `"
                class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div class="flex items-center">
              <TrashIcon
                @click="removeParticipant(index)"
                class="block size-7 flex-none cursor-pointer hover:text-green-900"
              />
            </div>
          </div>
          <div class="flex flex-row justify-between">
            <button
              @click="addParticipant"
              type="button"
              class="flex rounded-lg px-4 pb-2 text-center text-green-900 hover:text-green-500"
            >
              Add Person
              <PlusIcon class="my-auto ml-2 inline size-5 flex-none cursor-pointer" />
            </button>
          </div>
          <button
            type="submit"
            class="mt-3 -mb-3 flex w-full justify-center rounded-full bg-green-900 py-2 text-white hover:bg-green-700 sm:py-2!"
          >
            Send Invitations
            <EnvelopeIcon class="my-auto ml-2 inline size-5 cursor-pointer" />
          </button>
        </form>
      </div>
    </div>
    <div class="container mx-auto mt-8 max-w-7xl border-1 border-gray-300 p-8">
      <div>
        <h2 class="text-xl font-bold">How to Invite Friends to Your Gift Exchange</h2>
        <p class="py-2">
          Ready to get your gift exchange going? Inviting friends and family is quick and simple.
          Whether it's for Secret Santa, a birthday, or any special occasion, getting everyone
          together is half the fun!
        </p>
      </div>
      <div>
        <h2 class="pt-7 text-xl font-bold">How Does It Work?</h2>
        <p class="py-2">
          Sending invitations through Gift Meister is straightforward. Here's what you'll do:
        </p>
        <ul class="list-disc space-y-2 pl-5">
          <li>
            <b>Enter email addresses:</b>Add your friends' email addresses one by one in the spaces
            provided.
          </li>
          <li>
            <b>Add more people: </b>
            Hit the "Add Person" button if you need more spots for additional participants. Be aware
            that minimum 3 people are required to proceed.
          </li>
          <li>
            <b>Review the list:</b>
            Double-check all email addresses before sending.
          </li>
          <li>
            <b>Send invitations:</b>
            Click the "Send Invitations" button, and everyone will get their invite!
          </li>
        </ul>
      </div>
      <div>
        <h2 class="mt-7 text-xl font-bold">Benefits of Online Invitations</h2>
        <p class="py-2">Why use digital invites? Here's what makes them great:</p>
        <ul class="list-disc space-y-2 pl-5">
          <li><b>Track responses:</b> See who's joined and who still needs to respond.</li>
          <li>
            <b>Environmentally friendly: </b>
            No paper waste, just simple digital communication.
          </li>
        </ul>
      </div>
      <div>
        <h2 class="mt-7 text-xl font-bold">Tips for Inviting Participants</h2>
        <p class="py-2">Want to make sure everyone joins in? Here are some helpful tips:</p>
        <ul class="list-disc space-y-2 pl-5">
          <li><b>Double-check emails:</b> Make sure all addresses are typed correctly.</li>
          <li><b>Give advance notice:</b> Send invites early so everyone has time to respond.</li>
          <li>
            <b>Let people know:</b> Give friends a heads-up that an invite is coming their way.
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
