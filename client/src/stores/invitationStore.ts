import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useInvitationStore = defineStore('invitation', () => {
  const eventOrganiser = ref('')
  const eventDate = ref<Date | null>(null)

  function setEventDetails(date: Date, organiser: string) {
    eventDate.value = date
    eventOrganiser.value = organiser
  }

  return {
    eventOrganiser,
    eventDate,
    setEventDetails,
  }
})
