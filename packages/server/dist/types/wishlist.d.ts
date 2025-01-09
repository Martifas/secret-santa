import type { Wishlist } from "../database";
import type { Insertable, Selectable, Updateable } from "kysely";
export type WishlistRow = Wishlist;
export type WishlistWithoutIdsAndDates = Omit<WishlistRow, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'eventId'>;
export type WishlistRowSelect = Selectable<WishlistRow>;
export type WishlistRowInsert = Insertable<WishlistWithoutIdsAndDates>;
export type WishlistRowUpdate = Updateable<WishlistWithoutIdsAndDates>;
//# sourceMappingURL=wishlist.d.ts.map