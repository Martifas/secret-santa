import type { EventRule } from "@server/database";
import type { Insertable, Selectable, Updateable } from "kysely";

export type RuleRow = EventRule
export type RuleWihtoutIds = Omit<RuleRow, 'id' | 'eventId' >
export type RuleRowSelect = Selectable<RuleRow>
export type RuleRowInsert = Insertable<RuleWihtoutIds>
export type RuleRowUpdate = Updateable<RuleWihtoutIds>