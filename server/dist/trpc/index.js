import { initTRPC } from '@trpc/server';
import SuperJSON from 'superjson';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';
const t = initTRPC.context().create({
    transformer: SuperJSON,
    errorFormatter(opts) {
        const { shape, error } = opts;
        if (error.cause instanceof ZodError) {
            const validationError = fromZodError(error.cause);
            return {
                ...shape,
                data: {
                    message: validationError.message,
                },
            };
        }
        return shape;
    },
});
export const { createCallerFactory, mergeRouters, middleware, procedure: publicProcedure, router, } = t;
