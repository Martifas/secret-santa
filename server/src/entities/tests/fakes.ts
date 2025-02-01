import { random } from '@server/utils/tests/random'
import type { Insertable } from 'kysely'
import type {
  Event,
  EventInvitations,
  EventRule,
  Json,
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
const ROLES = ['administrator', 'participant']
const RULE_TYPES = ['budget', 'date', 'participant', 'wishlist']

const generateRuleData = (ruleType: string): Json => {
  switch (ruleType) {
    case 'budget':
      return {
        minAmount: random.integer({ min: 10, max: 100 }),
        maxAmount: random.integer({ min: 101, max: 1000 }),
        currency: 'USD',
      }
    case 'date':
      return {
        deadlineDate: random.date().toISOString(),
        reminderDays: random.integer({ min: 1, max: 7 }),
      }
    case 'participant':
      return {
        minParticipants: random.integer({ min: 3, max: 5 }),
        maxParticipants: random.integer({ min: 6, max: 20 }),
        allowExternalUsers: random.bool(),
      }
    case 'wishlist':
      return {
        minItems: random.integer({ min: 1, max: 3 }),
        maxItems: random.integer({ min: 4, max: 10 }),
        requireUrls: random.bool(),
      }
    default:
      return {}
  }
}

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
    name: random.word(),
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
    userId: randomId(),
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
    userId: randomId(),
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
    userId: randomId(),
    eventId: randomId(),
    role: random.pickone(ROLES),
    wishlistId: randomId(),
    santaForUserId: randomId(),
    ...overrides,
  }) satisfies Insertable<UserEvent>

/**
 * Generates a fake user event with some default test data.
 * @param overrides any properties that should be different from default fake data.
 */
export const fakeEventRule = <T extends Partial<Insertable<EventRule>>>(
  overrides: T = {} as T
) => {
  const ruleType = random.pickone(RULE_TYPES) // Define ruleType first

  return {
    eventId: randomId(),
    ruleType,
    ruleData: generateRuleData(ruleType),
    ...overrides,
  } satisfies Insertable<EventRule>
}
