import { random } from '@server/utils/tests/random'
import type { Insertable } from 'kysely'
import type {
  Event,
  EventInvitations,
  User,
  UserEvent,
  Wishlist,
} from '@server/database/types'
import type { AuthUser } from '../user'

const randomId = () =>
  random.integer({
    min: 1,
    max: 1000000,
  })

const now = new Date()
const EVENT_STATUS = ['draft', 'published', 'cancelled', 'completed']
const INVITATION_STATUS = ['sent', 'not sent', 'cancelled', 'confirmed']
const ROLES = ['admin', 'member']

/**
 * Generates a fake event with some default test data.
 * @param overrides any properties that should be different from default fake data.
 */
export const fakeEvent = <T extends Partial<Insertable<Event>>>(
  overrides: T = {} as T
) => {
  // Force the random date to be a Date object
  const randomDate = new Date(
    random.date({
      min: now,
      max: new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()),
    })
  )

  const dateWithoutTime = new Date(
    Date.UTC(
      randomDate.getFullYear(),
      randomDate.getMonth(),
      randomDate.getDate()
    )
  )

  return {
    budgetLimit: random.integer({ min: 10, max: 1000 }),
    createdBy: `auth0|${random.guid()}`,
    description: random.paragraph(),
    eventDate: dateWithoutTime,
    title: random.word(),
    status: random.pickone(EVENT_STATUS),
    ...overrides,
  } satisfies Insertable<Event>
}

/**
 * Generates a fake wishlist with some default test data.
 * @param overrides any properties that should be different from default fake data.
 */
export const fakeWishlist = <T extends Partial<Insertable<Wishlist>>>(
  overrides: T = {} as T
) =>
  ({
    description: random.paragraph(),
    itemName: random.word(),
    price: random.floating({ min: 1, max: 10000, fixed: 2 }),
    userId: `auth0|${random.guid()}`,
    userWishlistId: randomId(),
    ...overrides,
  }) satisfies Insertable<Wishlist>

/**
 * Generates a fake event invitation with some default test data.
 * @param overrides any properties that should be different from default fake data.
 */
export const fakeEventInvitation = <
  T extends Partial<Insertable<EventInvitations>>,
>(
  overrides: T = {} as T
) =>
  ({
    email: random.email(),
    userId: `auth0|${random.guid()}`,
    eventId: randomId(),
    status: random.pickone(INVITATION_STATUS),
    ...overrides,
  }) satisfies Insertable<EventInvitations>

/**
 * Generates a fake user with some default test data.
 * @param overrides any properties that should be different from default fake data.
 */
export const fakeUser = <T extends Partial<Insertable<User>>>(
  overrides: T = {} as T
) =>
  ({
    email: random.email(),
    firstName: random.first(),
    lastName: random.last(),
    auth0Id: `auth0|${random.guid()}`,
    picture: random.url(),
    ...overrides,
  }) satisfies Insertable<User>

export const fakeAuthUser = <T extends Partial<AuthUser>>(
  overrides: T = {} as T
): AuthUser => ({
  id: randomId(),
  email: random.email(),
  auth0Id: `auth0|${random.integer({ min: 1, max: 999 })}`,
  ...overrides,
})

/**
 * Generates a fake user event with some default test data.
 * @param overrides any properties that should be different from default fake data.
 */
export const fakeUserEvent = <T extends Partial<Insertable<UserEvent>>>(
  overrides: T = {} as T
) =>
  ({
    userId: `auth0|${random.guid()}`,
    eventId: randomId(),
    role: random.pickone(ROLES),
    wishlistId: randomId(),
    eventTitle: random.word(),
    ...overrides,
  }) satisfies Insertable<UserEvent>
