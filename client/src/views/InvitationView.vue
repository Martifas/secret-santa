<script setup lang="ts">
import { PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

const participants = ref([{ email: '' }])
const addParticipant = () => {
  participants.value.push({ email: '' })
}

const removeParticipant = (index: number) => {
  participants.value = participants.value.filter((_, i) => i !== index)
}
</script>

<template>
  <div>
    <div class="my-2 flex flex-row gap-2" v-for="(participant, index) in participants" :key="index">
      <div class="w-full">
        <label for="participant" class="mb-2 block text-sm font-medium text-gray-900"></label>
        <input
          type="email"
          id="participant"
          v-model="participant.email"
          :placeholder="`Participant's ${index + 1} email `"
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
        class="flex rounded-lg border-1 bg-green-900 px-4 py-2 text-center text-white hover:bg-green-700"
      >
        Add Participant
        <PlusIcon class="my-auto ml-2 inline size-5 flex-none cursor-pointer" />
      </button>
      <div class="flex justify-center text-sm">On the next page you can add send invitations.</div>
    </div>
  </div>
</template>
