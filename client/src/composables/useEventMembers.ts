import { ref } from 'vue'
import { trpc } from '@/trpc'

interface Member {
  firstName: string | null
  picture: string | null
  email: string | null
  auth0Id: string | null
}

export function useEventMembers(eventId: number) {
  const eventMembers = ref<Member[] | null>(null)
  const selectedMemberToKick = ref<Member | null>(null)
  const pendingInvitations = ref<number | null>(null)

  const getEventMembers = async () => {
    try {
      const members = await trpc.user.getUserNamePicEmailByEvent.query({ eventId })
      eventMembers.value = members
    } catch (error) {
      console.error('Error fetching event members:', error)
      eventMembers.value = null
    }
  }

  const getPendingInvitations = async () => {
    try {
      const invitations = await trpc.invitation.getPendingInvitations.query({ eventId })
      pendingInvitations.value = invitations.length
    } catch (error) {
      console.error('Error fetching invitations:', error)
      pendingInvitations.value = null
    }
  }

  return {
    eventMembers,
    selectedMemberToKick,
    pendingInvitations,
    getEventMembers,
    getPendingInvitations
  }
}