import { random } from '@tests/utils/random'
import type { Insertable } from 'kysely'
import type {
  Event,
  EventInvitations,
  User,
  Wishlist,
} from '@server/database/types'

const randomId = () =>
  random.integer({
    min: 1,
    max: 1000000,
  })

const now = new Date()
const EVENT_STATUS = ['draft', 'published', 'cancelled', 'completed']
const INVITATION_STATUS = ['sent', 'not sent', 'cancelled', 'confirmed']

/**
 * Generates a fake event with some default test data.
 * @param overrides any properties that should be different from default fake data.
 */
export const fakeEvent = <T extends Partial<Insertable<Event>>>(overrides: T) =>
  ({
    budgetLimit: random.integer({ min: 10, max: 1000 }),
    createdBy: randomId(),
    description: random.paragraph(),
    eventDate: random.date({
      min: now,
      max: new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()),
    }),
    name: random.word(),
    status: random.pickone(EVENT_STATUS),
    ...overrides,
  }) satisfies Insertable<Event>

/**
 * Generates a fake wishlist with some default test data.
 * @param overrides any properties that should be different from default fake data.
 */
export const fakeWishlist = <T extends Partial<Insertable<Wishlist>>>(
  overrides: T
) =>
  ({
    description: random.paragraph(),
    eventId: randomId(),
    isPurchased: false,
    itemName: random.word(),
    price: random.integer(),
    priority: random.integer({ min: 1, max: 5 }),
    url: random.url(),
    userId: randomId(),
    ...overrides,
  }) satisfies Insertable<Wishlist>

/**
 * Generates a fake event invitation with some default test data.
 * @param overrides any properties that should be different from default fake data.
 */
export const fakeEventInvitation = <
  T extends Partial<Insertable<EventInvitations>>,
>(
  overrides: T
) =>
  ({
    email: random.email(),
    eventId: randomId(),
    expiresAt: random.date({
      min: now,
      max: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7),
    }),
    status: random.pickone(INVITATION_STATUS),
    token: random.string(),
    ...overrides,
  }) satisfies Insertable<EventInvitations>

/**
 * Generates a fake user with some default test data.
 * @param overrides any properties that should be different from default fake data.
 */
export const fakeUser = <T extends Partial<Insertable<User>>>(overrides: T) =>
  ({
    avatarUrl: random.url(),
    email: random.email(),
    firstName: random.first(),
    lastName: random.last(),
    password: random.string({
      length: 12,
      pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    }),
    username:
      random.word({ length: 8 }).toLowerCase() +
      random.integer({ min: 100, max: 999 }),
    ...overrides,
  }) satisfies Insertable<User>
