import type { UserEvent } from "../database";
import type { Insertable, Selectable, Updateable } from "kysely";
export type UserEventRow = UserEvent;
export type UserEventWithoutIdsAndDates = Omit<UserEventRow, 'id' | 'userId' | 'eventId' | 'wishlistId' | 'santaForUserId' | 'createdAt' | 'updatedAt'>;
export type UserEventRowSelect = Selectable<UserEventRow>;
export type UserEventRowInsert = Insertable<UserEventWithoutIdsAndDates>;
export type UserEventRowUpdate = Updateable<UserEventWithoutIdsAndDates>;
//# sourceMappingURL=userEvent.d.ts.map