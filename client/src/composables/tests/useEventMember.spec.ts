import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/trpc', () => ({
  trpc: {
    user: {
      getUserNamePicEmailByEvent: {
        query: vi.fn(),
      },
    },
    invitation: {
      getPendingInvitations: {
        query: vi.fn(),
      },
    },
  },
}))

import { trpc } from '@/trpc'
import { useEventMembers } from '../useEventMembers'

describe('useEventMembers', () => {
  const mockEventId = 123
  const mockMembers = [
    {
      firstName: 'John',
      picture: 'http://example.com/john.jpg',
      email: 'john@example.com',
      auth0Id: 'auth0|123',
    },
    {
      firstName: 'Jane',
      picture: 'http://example.com/jane.jpg',
      email: 'jane@example.com',
      auth0Id: 'auth0|456',
    },
  ]

  const mockInvitations = [
    {
      id: 1,
      email: 'invited1@example.com',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      status: 'PENDING',
      eventId: mockEventId,
      userId: 'user1'
    },
    {
      id: 2,
      email: 'invited2@example.com',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      status: 'PENDING',
      eventId: mockEventId,
      userId: 'user2'
    },
    {
      id: 3,
      email: 'invited3@example.com',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      status: 'PENDING',
      eventId: mockEventId,
      userId: 'user3'
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getEventMembers', () => {
    it('should fetch and set event members successfully', async () => {
      vi.mocked(trpc.user.getUserNamePicEmailByEvent.query).mockResolvedValueOnce(mockMembers)
      const { eventMembers, getEventMembers } = useEventMembers(mockEventId)
      await getEventMembers()
      expect(trpc.user.getUserNamePicEmailByEvent.query).toHaveBeenCalledWith({
        eventId: mockEventId,
      })
      expect(eventMembers.value).toEqual(mockMembers)
    })

    it('should handle error when fetching event members', async () => {
      const error = new Error('Failed to fetch members')
      vi.mocked(trpc.user.getUserNamePicEmailByEvent.query).mockRejectedValueOnce(error)
      const consoleSpy = vi.spyOn(console, 'error')
      const { eventMembers, getEventMembers } = useEventMembers(mockEventId)
      await getEventMembers()
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching event members:', error)
      expect(eventMembers.value).toBeNull()
    })
  })

  describe('getPendingInvitations', () => {
    it('should fetch and set pending invitations count successfully', async () => {
      vi.mocked(trpc.invitation.getPendingInvitations.query).mockResolvedValueOnce(mockInvitations)
      const { pendingInvitations, getPendingInvitations } = useEventMembers(mockEventId)
      await getPendingInvitations()
      expect(trpc.invitation.getPendingInvitations.query).toHaveBeenCalledWith({
        eventId: mockEventId,
      })
      expect(pendingInvitations.value).toBe(3)
    })

    it('should handle error when fetching pending invitations', async () => {
      const error = new Error('Failed to fetch invitations')
      vi.mocked(trpc.invitation.getPendingInvitations.query).mockRejectedValueOnce(error)
      const consoleSpy = vi.spyOn(console, 'error')
      const { pendingInvitations, getPendingInvitations } = useEventMembers(mockEventId)
      await getPendingInvitations()
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching invitations:', error)
      expect(pendingInvitations.value).toBeNull()
    })
  })

  describe('selectedMemberToKick', () => {
    it('should initialize as null', () => {
      const { selectedMemberToKick } = useEventMembers(mockEventId)
      expect(selectedMemberToKick.value).toBeNull()
    })

    it('should be able to set a member', () => {
      const { selectedMemberToKick } = useEventMembers(mockEventId)
      const memberToKick = mockMembers[0]
      selectedMemberToKick.value = memberToKick
      expect(selectedMemberToKick.value).toEqual(memberToKick)
    })
  })
})