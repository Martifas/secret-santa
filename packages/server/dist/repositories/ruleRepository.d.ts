import type { Database, EventRule } from '../database';
import { type RuleForMember } from '../entities/eventRule';
import type { RuleRowSelect, RuleRowUpdate } from '../types/rule';
import type { Insertable } from 'kysely';
export declare function ruleRepository(db: Database): {
    findByEventId(eventId: number): Promise<RuleRowSelect[]>;
    create(rule: Insertable<EventRule>): Promise<RuleForMember>;
    update(id: number, updates: RuleRowUpdate): Promise<RuleForMember>;
    remove(id: number): Promise<RuleForMember>;
};
export type RuleRepository = ReturnType<typeof ruleRepository>;
//# sourceMappingURL=ruleRepository.d.ts.map