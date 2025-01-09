import { CamelCasePlugin, Kysely, ParseJSONResultsPlugin, PostgresDialect, } from 'kysely';
import pg from 'pg';
export function createDatabase(options) {
    return new Kysely({
        dialect: new PostgresDialect({
            pool: new pg.Pool(options),
        }),
        plugins: [new CamelCasePlugin(), new ParseJSONResultsPlugin()],
    });
}
export * from './types';
