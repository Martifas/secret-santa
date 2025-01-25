<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { FwbInput, FwbTextarea } from 'flowbite-vue'
import { Datepicker } from 'flowbite-datepicker'
import { TrashIcon, ArrowRightIcon, PlusIcon } from '@heroicons/vue/24/outline'
import { trpc } from '@/trpc'
import { useAuth0 } from '@auth0/auth0-vue'

const { user } = useAuth0()

interface ExchangeForm {
  title: string
  description: string
  budget: number
  date: string
  name: string
  participants: Array<{ email: string }>
}

const form = ref<ExchangeForm>({
  title: '',
  description: '',
  budget: 0,
  date: '',
  name: '',
  participants: [{ email: '' }],
})

const addParticipant = () => {
  form.value.participants.push({ email: '' })
}

const removeParticipant = (index: number) => {
  form.value.participants = form.value.participants.filter((_, i) => i !== index)
}

onMounted(() => {
  const datepickerElement = document.querySelector('[datepicker]') as HTMLElement
  if (datepickerElement) {
    new Datepicker(datepickerElement, {
      format: 'mm/dd/yyyy',
      autohide: true,
      todayHighlight: true,
      clearBtn: true,
      orientation: 'bottom',
    })

    datepickerElement.addEventListener('changeDate', (e: any) => {
      const date = e.detail.date
      if (date) {
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const year = date.getFullYear()
        form.value.date = `${month}/${day}/${year}`
      } else {
        form.value.date = ''
      }
    })
  }
})

async function createEvent() {
  try {
    if (!user.value?.sub) {
      throw new Error('User not authenticated')
    }

    if (!form.value.date) {
      throw new Error('Date is required')
    }

    const dateParts = form.value.date.split('/')
    if (dateParts.length !== 3) {
      throw new Error('Invalid date format')
    }

    const month = parseInt(dateParts[0]) - 1
    const day = parseInt(dateParts[1])
    const year = parseInt(dateParts[2])

    const eventDate = new Date(year, month, day)

    if (isNaN(eventDate.getTime())) {
      throw new Error('Invalid date')
    }

    const event = await trpc.event.createEvent.mutate({
      createdBy: user.value.sub,
      eventDate: eventDate,
      budgetLimit: form.value.budget,
      description: form.value.description,
      status: 'active',
      name: form.value.title,
    })

    // Reset form after successful creation
    form.value = {
      title: '',
      description: '',
      budget: 0,
      date: '',
      name: '',
      participants: [{ email: '' }],
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to create event:', error.message)
    } else {
      console.error('Failed to create event:', error)
    }
  }
}
</script>

<template>
  <div class="container mx-auto max-w-7xl px-4 py-8">
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
            <FwbInput v-model="form.title" placeholder="Enter a title" label="Title" required />

            <FwbTextarea
              v-model="form.description"
              placeholder="Description"
              label="Enter a description"
              :rows="5"
              class="text-black"
              required
            />

            <div class="flex flex-col gap-2 sm:flex-row">
              <div class="flex-1">
                <FwbInput
                  type="number"
                  min="0"
                  data-input-counter
                  v-model="form.budget"
                  placeholder="Enter a budget"
                  label="Budget"
                  required
                />
              </div>
              <div class="flex-1">
                <FwbInput
                  id="date"
                  datepicker
                  v-model="form.date"
                  label="Select date"
                  placeholder="Select date"
                  required
                />
              </div>
            </div>
          </div>
          <div>
            <div
              class="my-2 flex flex-row gap-2"
              v-for="(participant, index) in form.participants"
              :key="index"
            >
              <div class="w-full">
                <FwbInput
                  v-model="participant.email"
                  :placeholder="`Participant's ${index + 1} email `"
                  required
                  class="w-80"
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
                class="flex rounded-lg border-1 bg-green-900 px-4 py-2 text-center text-white hover:bg-green-700"
              >
                Add Participant
                <PlusIcon class="my-auto ml-2 inline size-5 flex-none cursor-pointer" />
              </button>
              <button
                type="submit"
                class="flex rounded-lg border-1 bg-sky-900 px-4 py-2 text-center text-white hover:bg-sky-700"
              >
                Create gift exchange
                <ArrowRightIcon class="my-auto ml-2 inline size-5 cursor-pointer" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div class="mt-8 border-1 border-gray-300 p-8">
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
    </div>
  </div>
</template>
