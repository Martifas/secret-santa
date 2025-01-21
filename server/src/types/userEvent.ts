import type { UserEvent } from '@server/database'
import type { Insertable, Selectable, Updateable } from 'kysely'

export type UserEventRow = UserEvent
export type UserEventWithoutIdsAndDates = Omit<
  UserEventRow,
  | 'id'
  | 'userId'
  | 'eventId'
  | 'wishlistId'
  | 'santaForUserId'
  | 'createdAt'
  | 'updatedAt'
>
export type UserEventRowSelect = Selectable<UserEventRow>
export type UserEventRowInsert = Insertable<UserEventWithoutIdsAndDates>
export type UserEventRowUpdate = Updateable<UserEventWithoutIdsAndDates>
export type UserIdRowSelect = Pick<UserEventRow, 'userId'>
export type SantaUserIdSelect = Pick<UserEventRow, 'santaForUserId'>
