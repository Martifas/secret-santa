import type { Database, Event } from '../database';
import { type EventForMember } from '../entities/event';
import type { EventRowSelect, EventRowUpdate } from '../types/event';
import type { Insertable } from 'kysely';
export declare function eventRepository(db: Database): {
    findAll(): Promise<EventRowSelect[]>;
    find(id: number): Promise<EventRowSelect | null>;
    create(event: Insertable<Event>): Promise<EventForMember>;
    update(id: number, updates: EventRowUpdate): Promise<EventForMember>;
    remove(id: number): Promise<EventForMember>;
    findAllForUser(userId: number): Promise<EventRowSelect[]>;
};
export type EventRepository = ReturnType<typeof eventRepository>;
//# sourceMappingURL=eventRepository.d.ts.map