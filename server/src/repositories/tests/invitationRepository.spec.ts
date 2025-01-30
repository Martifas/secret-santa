import { createTestDatabase } from '@server/utils/tests/database'
import { wrapInRollbacks } from '@server/utils/tests/transactions'
import { insertAll, selectAll } from '@server/utils/tests/record'
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
  fakeEventInvitation({ eventId: eventOne.id, userId: userOne.id, email: userOne.email }),
])

const fakeInvitationDefault = (
  invitation: Parameters<typeof fakeEventInvitation>[0] = {}
) =>
  fakeEventInvitation({
    userId: userOne.id,
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

describe('find all for user', () => {
  it('should return all invitations for the user', async () => {
    const [userTwo] = await insertAll(db, 'user', [fakeUser()])
    const [eventTwo] = await insertAll(db, 'event', [
      fakeEvent({ createdBy: userTwo.auth0Id }),
    ])
    const [invitationTwo] = await insertAll(db, 'eventInvitations', [
      fakeEventInvitation({ eventId: eventTwo.id, userId: userTwo.id }),
    ])

    const invitations = await repository.findAllForUser(userTwo.id)

    expect(invitations).toHaveLength(1)
    expect(invitations).toEqual([
      expect.objectContaining(pick(invitationTwo, invitationKeysForTesting)),
    ])
  })

  it('should return empty array when no events exist', async () => {
    await db.deleteFrom('eventInvitations').execute()

    const invitations = await repository.findAllForUser(userOne.id)

    expect(invitations).toEqual([])
  })
})

describe('create', () => {
  it('should create a new invitation', async () => {
    const invitation = fakeInvitationDefault()

    const createdInvitation = await repository.create(invitation)

    expect(createdInvitation).toMatchObject({
      ...pick(invitation, invitationKeysForTesting),
      id: expect.any(Number),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })
})

describe('update', () => {
  it('should update invitation attributes', async () => {
    const updates = {
      email: 'barsukas@miskas.lt',
      status: 'confirmed',
      expiresAt: new Date('2025-12-24'),
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

describe('remove', () => {
  it('should remove invitation', async () => {
    const removedInvitation = await repository.remove(invitationOne.id)
    expect(pick(removedInvitation, invitationKeysForTesting)).toEqual(
      pick(invitationOne, invitationKeysForTesting)
    )
    const result = await selectAll(db, 'eventInvitations')
    expect(result).toHaveLength(0)
  })

  it('should throw error when removing non-existent invivation', async () => {
    await expect(repository.remove(99999)).rejects.toThrowError(/no result/i)
  })
})
