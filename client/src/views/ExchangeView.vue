<script setup lang="ts">
import { ref } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { ArrowRightIcon } from '@heroicons/vue/24/outline'
import { trpc } from '@/trpc'
import { useAuth0 } from '@auth0/auth0-vue'
import { useRouter } from 'vue-router'
import { useInvitationStore } from '@/stores/invitationStore'
import ActionButton from '@/components/ActionButton.vue'
import Container from '@/components/Container.vue'
import InsctructionsContainer from '@/components/instructions/InsctructionsContainer.vue'

const isLoading = ref(false)
const { user } = useAuth0()
const router = useRouter()
const invitationStore = useInvitationStore()

type ExchangeForm = {
  title: string
  description: string
  budget: number
  date: Date | null
}

const form = ref<ExchangeForm>({
  title: '',
  description: '',
  budget: 0,
  date: null,
})

async function createEvent() {
  isLoading.value = true
  try {
    if (!user.value?.sub) {
      throw new Error('User not authenticated')
    }

    if (!form.value.date) {
      throw new Error('Date is required')
    }

    const createdEventId = await trpc.event.createEvent.mutate({
      createdBy: user.value.sub,
      eventDate: form.value.date,
      budgetLimit: form.value.budget,
      description: form.value.description,
      status: 'active',
      title: form.value.title,
    })

    await trpc.userEvent.createUserEvent.mutate({
      userId: user.value.sub,
      eventId: createdEventId,
      eventTitle: form.value.title,
      role: 'admin',
    })

    invitationStore.setEventDetails(form.value.date, user.value?.given_name || '')

    form.value = {
      title: '',
      description: '',
      budget: 0,
      date: null,
    }

    router.push({
      name: 'Invitation',
      params: {
        id: createdEventId,
      },
    })
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to create event:', error.message)
    } else {
      console.error('Failed to create event:', error)
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <Container>
    <div class="mt-7 flex gap-6">
      <div class="relative hidden h-[600px] basis-1/2 md:block">
        <img
          class="h-full w-full max-w-[500px] overflow-hidden rounded-lg object-cover object-center"
          src="https://images.unsplash.com/photo-1511893838767-e62649737e8e?q=80&w=1970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Gifts stacked near door"
        />
      </div>
      <div class="basis-full md:basis-1/2">
        <div class="mb-8">
          <h2 class="mb-4 text-3xl font-bold">Create Gift Exchange</h2>
          <p class="text-gray-600">
            Draw names for gifts online with Gift Meister. Easily add gifts and invite participants
            for a quick and simple gift exchange.
          </p>
        </div>

        <form class="space-y-6" @submit.prevent="createEvent">
          <div class="space-y-4">
            <label for="date" class="mb-2 block text-sm font-medium text-gray-900"
              >Enter a title<span class="text-red-500">*</span></label
            >
            <input
              type="text"
              id="title"
              v-model="form.title"
              placeholder="Title"
              required
              class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-md focus:border-blue-500 focus:ring-blue-500"
            />

            <label for="description" class="mb-2 block text-sm font-medium text-gray-900"
              >Enter a description<span class="text-red-500">*</span></label
            >

            <textarea
              id="description"
              v-model="form.description"
              rows="4"
              required
              class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-md focus:border-blue-500 focus:ring-blue-500"
              placeholder="Description"
            ></textarea>

            <div class="flex flex-col gap-2 sm:flex-row">
              <div class="flex-1">
                <label for="budget" class="mb-2 block text-sm font-medium text-gray-900"
                  >Budget<span class="text-red-500">*</span></label
                >
                <input
                  type="number"
                  v-model="form.budget"
                  id="budget"
                  required
                  placeholder="0"
                  class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-md focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div class="flex-1">
                <label for="date" class="mb-2 block text-sm font-medium text-gray-900"
                  >Select date<span class="text-red-500">*</span></label
                >
                <VueDatePicker
                  :enable-time-picker="false"
                  v-model="form.date"
                  class="shadow-md"
                  required
                  :min-date="new Date()"
                ></VueDatePicker>
              </div>
            </div>
          </div>

          <div class="flex justify-center text-sm sm:justify-end!">
            On the next page you can add send invitations.
          </div>

          <div class="flex w-full flex-row justify-center sm:justify-end!">
            <ActionButton type="submit" :loading="isLoading" variant="primary" size="md">
              Create gift exchange
              <ArrowRightIcon class="my-auto ml-2 inline size-5 cursor-pointer" />
            </ActionButton>
          </div>
        </form>
      </div>
    </div>
    <InsctructionsContainer>
      <div>
        <h2 class="text-xl font-bold">Draw Names with Gift Meister</h2>
        <p class="py-2">
          Make gift-giving fun and easy with Gift Meister, your go-to for stress-free name drawing.
          Our user-friendly platform walks you through every step, from gathering participants to
          picking out the perfect gifts, ensuring a fun time for everyone involved.
        </p>
      </div>
      <div>
        <h2 class="pt-7 text-xl font-bold">How Does It Work?</h2>
        <p class="py-2">
          Setting up a gift exchange with Happy Giftlist's is quick and hassle-free, leaving you to
          enjoy the best part - picking out great gifts!
        </p>
        <ul class="list-disc space-y-2 pl-5">
          <li><b>Create your account:</b> Get started using Facebook or Google account.</li>
          <li>
            <b>Organize a group gift exchange: </b>
            Just enter the event details, set a budget, and invite participants by adding their
            email addresses.
          </li>
          <li>
            <b>Avoid awkward pairings: </b>
            Our exclusion feature ensures everyone has a great time without any drama.
          </li>
        </ul>
      </div>
      <div>
        <h2 class="mt-7 text-xl font-bold">Choosing the Perfect Gift for Your Draw</h2>
        <p class="py-2">
          Finding the ideal gift can be simple with a little thought and creativity. Here are some
          tips to help you pick something special:
        </p>
        <ul class="list-disc space-y-2 pl-5">
          <li>
            <b>Encourage wishlist completion:</b> If they haven't already, nudge your gift recipient
            to fill out their wishlist.
          </li>
          <li>
            <b>Gather intel: </b>
            Collect clues about their preferences from friends or their social media profiles
          </li>
          <li>
            <b>Be creative:</b>
            Personalize your gift or choose something unique that shows you've put thought into it,
            like a custom-made item.
          </li>
        </ul>
      </div>
      <div>
        <h2 class="mt-7 text-xl font-bold">Benefits of Drawing Names</h2>
        <p class="py-2">
          Drawing names for gift exchanges is an exciting way to celebrate with friends, family, or
          colleagues. Here are a few reasons why it's great:
        </p>
        <ul class="list-disc space-y-2 pl-5">
          <li>
            <b>Shared joy:</b> Everyone gets to experience the excitement and surprise as gifts are
            revealed.
          </li>
          <li>
            <b>Thoughtful gifting:</b> It encourages picking gifts that truly resonate with the
            recipient, often leading to delightful surprises.
          </li>
          <li>
            <b>Stronger bonds:</b> This fun tradition is perfect for strengthening relationships and
            making lasting memories during the festive season.
          </li>
        </ul>
      </div>
      <div>
        <h2 class="mt-7 text-xl font-bold">Is Happy Giftmeister Free?</h2>
        <p class="py-2">
          Yes, Happy Giftlist is totally free! Whether you’re arranging a gift exchange, creating
          wishlists for special events, or just keeping track of your holiday desires, Happy
          Giftlist is here to help at no cost to you.
        </p>
      </div>
    </InsctructionsContainer>
  </Container>
</template>
