import { TRPCError } from '@trpc/server';
import { publicProcedure } from '../../trpc/index';
import { parseTokenPayload } from './tokenPayload';
import { verifyAuth0Token } from './auth0Client';

export const authenticatedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (ctx.authUser) {
    return next({
      ctx: {
        authUser: ctx.authUser,
      },
    });
  }

  if (!ctx.req) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Missing Express request object.',
    });
  }

  const authHeader = ctx.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Unauthenticated. Please log in.',
    });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const payload = await verifyAuth0Token(token);
    const authUser = parseTokenPayload(payload);

    return next({
      ctx: {
        authUser,
      },
    });
  } catch (error) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Invalid token.',
    });
  }
});