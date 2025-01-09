import { Kysely } from 'kysely';
import pg from 'pg';
import type { DB } from './types';
export declare function createDatabase(options: pg.PoolConfig): Kysely<DB>;
export type Database = Kysely<DB>;
export type DatabasePartial<T> = Kysely<T>;
export * from './types';
//# sourceMappingURL=index.d.ts.map