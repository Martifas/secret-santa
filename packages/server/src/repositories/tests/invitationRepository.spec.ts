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