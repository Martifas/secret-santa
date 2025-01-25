<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { FwbInput, FwbTextarea } from 'flowbite-vue'
import { Datepicker } from 'flowbite-datepicker'
import { TrashIcon } from '@heroicons/vue/24/outline'

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
    })
  }
})
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
          <h2 class="mb-4 text-3xl font-bold">Draw Names Online</h2>
          <p class="text-gray-600">
            Draw names for gifts online with Gift Meister. Easily add gifts and invite participants
            for a quick and simple gift exchange.
          </p>
        </div>

        <form class="space-y-6" @submit.prevent>
          <div class="space-y-4">
            <FwbInput v-model="form.title" placeholder="Enter a title" label="Title" required />

            <FwbTextarea
              v-model="form.description"
              placeholder="Description"
              label="Enter a description"
              :rows="5"
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
            <button
              @click="addParticipant"
              type="button"
              class="rounded-lg border-1 px-4 py-2 text-center text-white hover:bg-green-700 bg-green-900"
            >
              Add Participant
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
