import type { Request, Response } from 'express';
import type { AuthUser } from '../entities/user';
import type { Database } from '../database';
import SuperJSON from 'superjson';
import type { Repositories } from '../repositories';
export type Context = {
    db: Database;
    req?: Request;
    res?: Response;
    authUser?: AuthUser;
    repos?: Partial<Repositories>;
};
export type ContextMinimal = Pick<Context, 'db'>;
export declare const createCallerFactory: <TRouter extends import("@trpc/server").Router<import("@trpc/server").AnyRouterDef<import("@trpc/server").RootConfig<{
    ctx: Context;
    meta: object;
    errorShape: import("@trpc/server").DefaultErrorShape | {
        data: {
            message: string;
        };
        message: string;
        code: import("@trpc/server/dist/rpc").TRPC_ERROR_CODE_NUMBER;
    };
    transformer: typeof SuperJSON;
}>, any>>>(router: TRouter) => import("@trpc/server").RouterCaller<TRouter["_def"]>, mergeRouters: typeof import("@trpc/server").mergeRouters, middleware: <TNewParams extends import("@trpc/server").ProcedureParams<import("@trpc/server").AnyRootConfig, unknown, unknown, unknown, unknown, unknown, unknown>>(fn: import("@trpc/server").MiddlewareFunction<{
    _config: import("@trpc/server").RootConfig<{
        ctx: Context;
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape | {
            data: {
                message: string;
            };
            message: string;
            code: import("@trpc/server/dist/rpc").TRPC_ERROR_CODE_NUMBER;
        };
        transformer: typeof SuperJSON;
    }>;
    _ctx_out: {};
    _input_out: typeof import("@trpc/server").unsetMarker;
    _input_in: unknown;
    _output_in: unknown;
    _output_out: unknown;
    _meta: object;
}, TNewParams>) => import("@trpc/server").MiddlewareBuilder<{
    _config: import("@trpc/server").RootConfig<{
        ctx: Context;
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape | {
            data: {
                message: string;
            };
            message: string;
            code: import("@trpc/server/dist/rpc").TRPC_ERROR_CODE_NUMBER;
        };
        transformer: typeof SuperJSON;
    }>;
    _ctx_out: {};
    _input_out: typeof import("@trpc/server").unsetMarker;
    _input_in: unknown;
    _output_in: unknown;
    _output_out: unknown;
    _meta: object;
}, TNewParams>, publicProcedure: import("@trpc/server").ProcedureBuilder<{
    _config: import("@trpc/server").RootConfig<{
        ctx: Context;
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape | {
            data: {
                message: string;
            };
            message: string;
            code: import("@trpc/server/dist/rpc").TRPC_ERROR_CODE_NUMBER;
        };
        transformer: typeof SuperJSON;
    }>;
    _ctx_out: Context;
    _input_in: typeof import("@trpc/server").unsetMarker;
    _input_out: typeof import("@trpc/server").unsetMarker;
    _output_in: typeof import("@trpc/server").unsetMarker;
    _output_out: typeof import("@trpc/server").unsetMarker;
    _meta: object;
}>, router: <TProcRouterRecord extends import("@trpc/server").ProcedureRouterRecord>(procedures: TProcRouterRecord) => import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx: Context;
    meta: object;
    errorShape: import("@trpc/server").DefaultErrorShape | {
        data: {
            message: string;
        };
        message: string;
        code: import("@trpc/server/dist/rpc").TRPC_ERROR_CODE_NUMBER;
    };
    transformer: typeof SuperJSON;
}>, TProcRouterRecord>;
//# sourceMappingURL=index.d.ts.map