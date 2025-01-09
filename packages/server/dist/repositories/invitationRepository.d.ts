import type { Database, EventInvitations } from '../database';
import { type InvitationForMember } from '../entities/eventInvitation';
import type { InvitationRowSelect, InvitationRowUpdate } from '../types/invitation';
import type { Insertable } from 'kysely';
export declare function invitationRepository(db: Database): {
    findById(id: number): Promise<InvitationRowSelect | null>;
    findByEventAndUserId(eventId: number, userId: number): Promise<InvitationRowSelect | null>;
    findAllForUser(userId: number): Promise<InvitationRowSelect[]>;
    create(invitation: Insertable<EventInvitations>): Promise<InvitationForMember>;
    update(id: number, updates: InvitationRowUpdate): Promise<InvitationForMember>;
    remove(id: number): Promise<InvitationForMember>;
};
export type InvitationRepository = ReturnType<typeof invitationRepository>;
//# sourceMappingURL=invitationRepository.d.ts.map