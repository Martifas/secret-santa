import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/trpc', () => ({
  trpc: {
    event: {
      getEvent: {
        query: vi.fn(),
      },
      removeEvent: {
        mutate: vi.fn(),
      },
    },
    invitation: {
      getInvitation: {
        query: vi.fn(),
      },
      updateInvitation: {
        mutate: vi.fn(),
      },
    },
    userEvent: {
      assignSecretSanta: {
        mutate: vi.fn(),
      },
      getSantee: {
        query: vi.fn(),
      },
      createUserEvent: {
        mutate: vi.fn(),
      },
    },
  },
}))

vi.mock('@auth0/auth0-vue', () => ({
  useAuth0: vi.fn(),
}))

import { trpc } from '@/trpc'
import { useAuth0 } from '@auth0/auth0-vue'
import { useEventManagement } from '../useEventManagement'

describe('useEventManagement', () => {
  const mockEventId = 123
  const mockUser = {
    value: {
      sub: 'user123',
      email: 'test@example.com',
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useAuth0).mockReturnValue({ user: mockUser } as any)
  })

  describe('validateMember', () => {
    it('should identify creator correctly', async () => {
      vi.mocked(trpc.event.getEvent.query).mockResolvedValueOnce({
        id: mockEventId,
        createdBy: 'user123',
        title: 'Test Event',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active',
        budgetLimit: 50,
        description: 'Test event description',
        eventDate: new Date(),
      })

      const { validateMember, isValidMember, isCreator } = useEventManagement(mockEventId)
      await validateMember()

      expect(isValidMember.value).toBe(true)
      expect(isCreator.value).toBe(true)
    })

    it('should validate regular member correctly', async () => {
      vi.mocked(trpc.event.getEvent.query).mockResolvedValueOnce({
        id: mockEventId,
        createdBy: 'different-user',
        title: 'Test Event',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active',
        budgetLimit: 50,
        description: 'Test event description',
        eventDate: new Date(),
      })

      vi.mocked(trpc.invitation.getInvitation.query).mockResolvedValueOnce({
        id: 1,
        eventId: mockEventId,
        email: 'test@example.com',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: null,
      })

      const { validateMember, isValidMember, isCreator } = useEventManagement(mockEventId)
      await validateMember()

      expect(isValidMember.value).toBe(true)
      expect(isCreator.value).toBe(false)
    })

    it('should handle unauthenticated user', async () => {
      vi.mocked(useAuth0).mockReturnValue({ user: { value: null } } as any)

      const { validateMember, isValidMember, isCreator } = useEventManagement(mockEventId)
      await validateMember()

      expect(isValidMember.value).toBe(false)
      expect(isCreator.value).toBe(false)
    })

    it('should handle validation error', async () => {
      vi.mocked(trpc.event.getEvent.query).mockRejectedValueOnce(new Error('Network error'))

      const { validateMember, isValidMember, isCreator } = useEventManagement(mockEventId)
      await validateMember()

      expect(isValidMember.value).toBe(false)
      expect(isCreator.value).toBe(false)
    })
  })

  describe('drawSecretSantas', () => {
    it('should successfully draw secret santas', async () => {
      const mockResponse = {
        success: true,
        message: 'Secret Santa assignments completed successfully',
        totalAssignments: 10,
        emailsSent: 10,
      }
      vi.mocked(trpc.userEvent.assignSecretSanta.mutate).mockResolvedValueOnce(mockResponse)

      const { drawSecretSantas } = useEventManagement(mockEventId)
      const result = await drawSecretSantas()

      expect(result).toEqual(mockResponse)
      expect(trpc.userEvent.assignSecretSanta.mutate).toHaveBeenCalledWith({ eventId: mockEventId })
    })

    it('should handle drawing error', async () => {
      vi.mocked(trpc.userEvent.assignSecretSanta.mutate).mockRejectedValueOnce(
        new Error('Drawing failed')
      )

      const { drawSecretSantas } = useEventManagement(mockEventId)
      await expect(drawSecretSantas()).rejects.toThrow('Drawing failed')
    })
  })

  describe('getSecretSantaAssignment', () => {
    it('should fetch and set secret santa assignment', async () => {
      const mockAssignment = {
        firstName: 'John',
        santeeId: 'santee123',
      }
      vi.mocked(trpc.userEvent.getSantee.query).mockResolvedValueOnce(mockAssignment)

      const { getSecretSantaAssignment, secretSantaAssignmentName, secretSantaAssignmentId } =
        useEventManagement(mockEventId)
      await getSecretSantaAssignment()

      expect(secretSantaAssignmentName.value).toBe('John')
      expect(secretSantaAssignmentId.value).toBe('santee123')
    })

    it('should handle assignment fetch error', async () => {
      vi.mocked(trpc.userEvent.getSantee.query).mockRejectedValueOnce(new Error('Fetch failed'))
      const consoleSpy = vi.spyOn(console, 'error')

      const { getSecretSantaAssignment } = useEventManagement(mockEventId)
      await getSecretSantaAssignment()

      expect(consoleSpy).toHaveBeenCalled()
    })
  })
  describe('deleteEvent', () => {
    it('should successfully delete event', async () => {
      vi.mocked(trpc.event.removeEvent.mutate).mockResolvedValueOnce({ success: true })

      const { deleteEvent } = useEventManagement(mockEventId)
      const result = await deleteEvent()

      expect(result).toBe(true)
      expect(trpc.event.removeEvent.mutate).toHaveBeenCalledWith({ id: mockEventId })
    })

    it('should handle delete error', async () => {
      vi.mocked(trpc.event.removeEvent.mutate).mockRejectedValueOnce(new Error('Delete failed'))

      const { deleteEvent } = useEventManagement(mockEventId)
      const result = await deleteEvent()

      expect(result).toBe(false)
    })
  })

  describe('updateInviteesRecords', () => {
    it('should update records for valid member', async () => {
      const { updateInviteesRecords, isValidMember, isCreator, eventDetails } =
        useEventManagement(mockEventId)

      isValidMember.value = true
      isCreator.value = false
      eventDetails.value = { title: 'Test Event' } as any

      await updateInviteesRecords()

      expect(trpc.userEvent.createUserEvent.mutate).toHaveBeenCalledWith({
        userId: 'user123',
        eventId: mockEventId,
        eventTitle: 'Test Event',
        role: 'member',
      })
      expect(trpc.invitation.updateInvitation.mutate).toHaveBeenCalledWith({
        eventId: mockEventId,
        email: 'test@example.com',
      })
    })

    it('should not update records for unauthenticated user', async () => {
      vi.mocked(useAuth0).mockReturnValue({ user: { value: null } } as any)

      const { updateInviteesRecords } = useEventManagement(mockEventId)
      await updateInviteesRecords()

      expect(trpc.userEvent.createUserEvent.mutate).not.toHaveBeenCalled()
      expect(trpc.invitation.updateInvitation.mutate).not.toHaveBeenCalled()
    })
  })
})
