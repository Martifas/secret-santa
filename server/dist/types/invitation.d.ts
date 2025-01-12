import type { EventInvitations } from "../database";
import type { Insertable, Selectable, Updateable } from "kysely";
export type InvitationRow = EventInvitations;
export type InvitationWithoutIdsAndDates = Omit<InvitationRow, 'id' | 'createdAt' | 'eventId' | 'userId' | 'updatedAt'>;
export type InvitationRowSelect = Selectable<InvitationRow>;
export type InvitationRowInsert = Insertable<InvitationWithoutIdsAndDates>;
export type InvitationRowUpdate = Updateable<InvitationWithoutIdsAndDates>;
//# sourceMappingURL=invitation.d.ts.map