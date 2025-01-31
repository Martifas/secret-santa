import type { UserWishlist } from '@server/database'
import type { Updateable } from 'kysely'

export type UserWishlistRow = UserWishlist
export type UserWishlistWithoutIdsAndDates = Omit<
  UserWishlist,
  'id' | 'createdAt | updatedAt'
>
export type UserWishlistRowUpdate = Updateable<UserWishlistWithoutIdsAndDates>
