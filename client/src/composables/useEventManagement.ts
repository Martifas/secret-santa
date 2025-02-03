import { ref } from 'vue'
import { trpc } from '@/trpc'
import type { EventForMember } from '@server/entities/event'
import { useAuth0 } from '@auth0/auth0-vue'

export function useEventManagement(eventId: number) {
  const { user } = useAuth0()
  const eventDetails = ref<EventForMember | null>(null)
  const isValidMember = ref<boolean | null>(null)
  const isCreator = ref<boolean | null>(null)
  const secretSantaName = ref<string | null>('')

  const validateMember = async () => {
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

  const drawSecretSantas = async () => {
    try {
      await trpc.userEvent.assignSecretSanta.mutate({ eventId })
    } catch (error) {
      console.error('Error drawing names:', error)
    }
  }

  const getSecretSanta = async () => {
    try {
      const santa = await trpc.userEvent.getSecretSanta.query({ eventId })
      secretSantaName.value = santa
    } catch (error) {
      console.error('Error getting secret santa:', error)
    }
  }

  const deleteEvent = async () => {
    try {
      await trpc.event.removeEvent.mutate({ id: eventId })
      return true
    } catch (error) {
      console.error('Error deleting event:', error)
      return false
    }
  }

  const updateInviteesRecords = async () => {
    try {
      if (!user.value?.sub || !user.value.email) {
        console.error('User not authenticated')
        return
      }

      if (isValidMember.value && !isCreator.value && eventDetails.value) {
        await trpc.userEvent.createUserEvent.mutate({
          userId: user.value.sub,
          eventId,
          eventTitle: eventDetails.value.title,
          role: 'member',
        })

        await trpc.invitation.updateInvitation.mutate({ 
          eventId, 
          email: user.value.email 
        })
      }
    } catch (error) {
      console.error('Error updating records:', error)
    }
  }

  return {
    eventDetails,
    isValidMember,
    isCreator,
    secretSantaName,
    validateMember,
    drawSecretSantas,
    getSecretSanta,
    deleteEvent,
    updateInviteesRecords
  }
}