import type { Database } from '../database';
import type { UserEventRowSelect, UserEventRowUpdate } from '../types/userEvent';
import type { Insertable } from 'kysely';
import type { UserEvent } from '../database/types';
import type { UserEventForMember } from '../entities/userEvent';
export declare function userEventRepository(db: Database): {
    findByEventAndUserId(eventId: number, userId: number): Promise<UserEventRowSelect | null>;
    create(record: Insertable<UserEvent>): Promise<UserEventForMember>;
    updateRole(id: number, updates: UserEventRowUpdate): Promise<UserEventForMember>;
    isEventAdmin(userId: number, eventId: number): Promise<boolean>;
    isMember(eventId: number, userId: number): Promise<boolean>;
    remove(id: number): Promise<UserEventForMember>;
};
export type UserEventRepository = ReturnType<typeof userEventRepository>;
//# sourceMappingURL=userEventRepository.d.ts.map