import { createTestDatabase } from '@server/utils/tests/database'
import { wrapInRollbacks } from '@server/utils/tests/transactions'
import { insertAll } from '@server/utils/tests/record'
import {
  fakeEvent,
  fakeEventInvitation,
  fakeUser,
} from '@server/entities/tests/fakes'
import { invitationKeysForTesting } from '@server/entities/eventInvitation'
import { pick } from 'lodash-es'
import { invitationRepository } from '../invitationRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = invitationRepository(db)
const [userOne] = await insertAll(db, 'user', fakeUser())
const [eventOne] = await insertAll(db, 'event', [
  fakeEvent({ createdBy: userOne.auth0Id }),
])
const [invitationOne] = await insertAll(db, 'eventInvitations', [
  fakeEventInvitation({
    eventId: eventOne.id,
    userId: userOne.auth0Id,
    email: userOne.email,
    status: 'accepted',
  }),
])

const fakeInvitationDefault = (
  invitation: Parameters<typeof fakeEventInvitation>[0] = {}
) =>
  fakeEventInvitation({
    userId: userOne.auth0Id,
    eventId: eventOne.id,
    ...invitation,
  })

describe('findById', () => {
  it('should return an invitation for a specific id', async () => {
    const foundInvitation = await repository.findById(invitationOne.id)

    expect(foundInvitation).not.toBeNull()
    if (!foundInvitation) throw new Error('No invitation found')

    expect(pick(foundInvitation, invitationKeysForTesting)).toEqual(
      pick(invitationOne, invitationKeysForTesting)
    )
  })

  it('should return null for non-existent id', async () => {
    const foundInvitation = await repository.findById(99999)

    expect(foundInvitation).toBeNull()
  })
})

describe('find by event and email', () => {
  it('should return an invitation for a specific event and user', async () => {
    const foundInvitation = await repository.findByEventAndEmail(
      eventOne.id,
      userOne.email
    )
    expect(foundInvitation).not.toBeNull()
    if (!foundInvitation) throw new Error('No invitation found')

    expect(pick(foundInvitation, invitationKeysForTesting)).toEqual(
      pick(invitationOne, invitationKeysForTesting)
    )
  })
})

describe('create', () => {
  it('should create a new invitation', async () => {
    const invitation = fakeInvitationDefault()

    const createdInvitationId = await repository.create(invitation)

    const createdInvitation = await repository.findById(createdInvitationId)
    expect(createdInvitation).toMatchObject({
      eventId: invitation.eventId,
      userId: invitation.userId,
      email: invitation.email,
    })
  })
})

describe('update', () => {
  it('should update invitation attributes', async () => {
    const updates = {
      email: 'barsukas@miskas.lt',
      status: 'confirmed',
    }
    const updatedInvitation = await repository.update(invitationOne.id, updates)
    expect(pick(updatedInvitation, invitationKeysForTesting)).toEqual(
      pick(updates, invitationKeysForTesting)
    )
    expect(updatedInvitation.id).toBe(invitationOne.id)
    expect(updatedInvitation.userId).toBe(invitationOne.userId)
    expect(updatedInvitation.updatedAt).toBeInstanceOf(Date)
  })

  it('should throw error when updating non-existent invitation', async () => {
    const updates = {
      email: 'vilask@miskas.lt',
    }
    await expect(repository.update(99999, updates)).rejects.toThrowError(
      /no result/i
    )
  })
})

describe('findPendingInvitationsForEvent', () => {
  it('should return only pending invitations for an event', async () => {
    const pendingInvitation1 = fakeInvitationDefault({ status: 'sent' })
    const pendingInvitation2 = fakeInvitationDefault({
      status: 'sent',
      email: 'another@example.com',
    })
    const confirmedInvitation = fakeInvitationDefault({
      status: 'confirmed',
      email: 'confirmed@example.com',
    })

    await repository.create(pendingInvitation1)
    await repository.create(pendingInvitation2)
    await repository.create(confirmedInvitation)

    const pendingInvitations = await repository.findPendingInvitationsForEvent(
      eventOne.id
    )

    expect(pendingInvitations).toHaveLength(2)
    pendingInvitations.forEach((invitation) => {
      expect(invitation.status).toBe('sent')
      expect(invitation.eventId).toBe(eventOne.id)
    })
  })

  it('should return empty array for event with no pending invitations', async () => {
    const result = await repository.findPendingInvitationsForEvent(99999)
    expect(result).toEqual([])
  })
})

describe('updateStatus', () => {
  it('should update only the status of an invitation', async () => {
    const originalInvitation = await repository.findById(invitationOne.id)
    expect(originalInvitation).not.toBeNull()

    const updatedId = await repository.updateStatus(
      invitationOne.id,
      'confirmed'
    )
    expect(updatedId).toBe(invitationOne.id)

    const updatedInvitation = await repository.findById(invitationOne.id)
    expect(updatedInvitation?.status).toBe('confirmed')
    expect(updatedInvitation?.email).toBe(originalInvitation?.email)
    expect(updatedInvitation?.updatedAt).not.toEqual(
      originalInvitation?.updatedAt
    )
  })

  it('should throw error when updating non-existent invitation status', async () => {
    await expect(
      repository.updateStatus(99999, 'confirmed')
    ).rejects.toThrowError(/no result/i)
  })
})

describe('removeById', () => {
  it('should remove a specific invitation', async () => {
    const removedId = await repository.removeById(invitationOne.id)
    expect(removedId).toBe(invitationOne.id)

    const removedInvitation = await repository.findById(invitationOne.id)
    expect(removedInvitation).toBeNull()
  })
})

describe('removeByEventId', () => {
  it('should remove all invitations for an event', async () => {
    const invitation2 = fakeInvitationDefault({ email: 'test2@example.com' })
    const invitation3 = fakeInvitationDefault({ email: 'test3@example.com' })

    await repository.create(invitation2)
    await repository.create(invitation3)

    const removedIds = await repository.removeByEventId(eventOne.id)
    expect(removedIds.length).toBeGreaterThan(0)

    const remainingInvitations = await db
      .selectFrom('eventInvitations')
      .select(['id'])
      .where('eventId', '=', eventOne.id)
      .execute()

    expect(remainingInvitations).toHaveLength(0)
  })

  it('should return empty array when no invitations exist for event', async () => {
    const removedIds = await repository.removeByEventId(99999)
    expect(removedIds).toEqual([])
  })
})

describe('removeUserByEventId', () => {
  it('should remove invitation for specific user and event', async () => {
    const removedId = await repository.removeUserByEventId(
      eventOne.id,
      userOne.auth0Id
    )
    expect(removedId).toBe(invitationOne.id)

    const removedInvitation = await repository.findById(invitationOne.id)
    expect(removedInvitation).toBeNull()
  })

  it('should return null when no invitation exists for user and event', async () => {
    const result = await repository.removeUserByEventId(
      99999,
      'non-existent-user'
    )
    expect(result).toBeNull()
  })
})

describe('findByEventAndEmail', () => {
  it('should return null when no invitation exists for event and email', async () => {
    const result = await repository.findByEventAndEmail(
      eventOne.id,
      'nonexistent@example.com'
    )
    expect(result).toBeNull()
  })
})

describe('create', () => {
  it('should handle creation with minimal required fields', async () => {
    const minimalInvitation = {
      eventId: eventOne.id,
      userId: userOne.auth0Id,
      email: 'minimal@example.com',
      status: 'pending',
    }

    const createdId = await repository.create(minimalInvitation)
    const createdInvitation = await repository.findById(createdId)

    expect(createdInvitation).toMatchObject(minimalInvitation)
    expect(createdInvitation?.createdAt).toBeInstanceOf(Date)
    expect(createdInvitation?.updatedAt).toBeInstanceOf(Date)
  })
})
