import type { Event } from "../database";
import type { Insertable, Selectable, Updateable } from 'kysely';
export type EventRow = Event;
export type EventowWithoutIdsAndDates = Omit<EventRow, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>;
export type EventRowSelect = Selectable<EventRow>;
export type EventRowInsert = Insertable<EventowWithoutIdsAndDates>;
export type EventRowUpdate = Updateable<EventowWithoutIdsAndDates>;
//# sourceMappingURL=event.d.ts.map