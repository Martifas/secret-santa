import { createTestDatabase } from "@tests/utils/database";
import { wrapInRollbacks } from "@tests/utils/transactions";
import { insertAll } from "@tests/utils/record";
import { fakeEvent, fakeEventInvitation, fakeUser } from "@server/entities/tests/fakes";
import { invitationKeysForTesting } from "@server/entities/eventInvitation";
import { pick } from "lodash-es";
import { invitationRepository } from "../invitationRepository";


const db = await wrapInRollbacks(createTestDatabase())
const repository = invitationRepository(db)
const [userOne] = await insertAll(db, 'user', fakeUser())
const [eventOne] = await insertAll(db, 'event', [
  fakeEvent({ createdBy: userOne.id }),
])
const [invitationOne] = await insertAll(db, 'eventInvitations', [fakeEventInvitation({eventId: eventOne.id, userId: userOne.id})]) 

const fakeInvitationDefault = (invitation: Parameters<typeof fakeEventInvitation>[0] = {}) =>
  fakeEventInvitation({ userId: userOne.id, eventId: eventOne.id, ...invitation })

describe('find by event and user id', () => {
  it('should return an invitation for a specific event and user', async () => {
    const foundInvitation = await repository.findByEventAndUserId(
      eventOne.id,
      userOne.id
    )
    expect(foundInvitation).not.toBeNull()
    if (!foundInvitation) throw new Error('No invitation found')

    expect(pick(foundInvitation, invitationKeysForTesting)).toEqual(
      pick(invitationOne, invitationKeysForTesting)
    )
  })
})

describe('find all', () => {
  it('should return all invitation for the event', async () => {
    const [userTwo] = await insertAll(db, 'user', [fakeUser()])
    const [eventTwo] = await insertAll(db, 'event', [
      fakeEvent({ createdBy: userTwo.id }),
    ])
    const [invitationTwo] = await insertAll(db, 'eventInvitations', [fakeEventInvitation({eventId: eventTwo.id, userId: userTwo.id})]) 

    const invitations = await repository.findAll()

    expect(invitations).toHaveLength(2)
    expect(invitations).toEqual(
      expect.arrayContaining([
        expect.objectContaining(pick(invitationOne, invitationKeysForTesting)),
        expect.objectContaining(pick(invitationTwo, invitationKeysForTesting)),
      ])
    )
  })

  it('should return empty array when no events exist', async () => {
    await db.deleteFrom('eventInvitations').execute()

    const invitations = await repository.findAll()

    expect(invitations).toEqual([])
  })
})