export declare const authenticatedProcedure: import("@trpc/server").ProcedureBuilder<{
    _config: import("@trpc/server").RootConfig<{
        ctx: import("..").Context;
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape | {
            data: {
                message: string;
            };
            message: string;
            code: import("@trpc/server/dist/rpc").TRPC_ERROR_CODE_NUMBER;
        };
        transformer: typeof import("superjson").default;
    }>;
    _meta: object;
    _ctx_out: {
        db: import("../../database").Database;
        req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> | undefined;
        res: import("express").Response<any, Record<string, any>> | undefined;
        authUser: {
            id: number;
        };
        repos: Partial<import("../../repositories").Repositories> | undefined;
    };
    _input_in: typeof import("@trpc/server").unsetMarker;
    _input_out: typeof import("@trpc/server").unsetMarker;
    _output_in: typeof import("@trpc/server").unsetMarker;
    _output_out: typeof import("@trpc/server").unsetMarker;
}>;
//# sourceMappingURL=index.d.ts.map