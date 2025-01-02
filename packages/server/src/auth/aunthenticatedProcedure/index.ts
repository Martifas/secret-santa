import { TRPCError } from '@trpc/server';
import { publicProcedure } from '@server/trpc/index';
import { parseTokenPayload, auth0PayloadSchema } from './tokenPayload';
import { verifyAuth0Token } from './auth0Client';

export const authenticatedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (ctx.authUser) {
    return next({
      ctx: {
        authUser: ctx.authUser,
      },
    });
  }
  if (!ctx.req || !ctx.repos?.userRepository) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Missing required context.',
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
    const auth0User = parseTokenPayload(payload);
    const parsedPayload = auth0PayloadSchema.parse(payload);

    const user = await ctx.repos.userRepository.findOrCreateFromAuth0(
      auth0User.auth0Id,
      parsedPayload.email ?? '',
      {
        firstName: parsedPayload.given_name ?? null,
        lastName: parsedPayload.family_name ?? null,
        avatarUrl: parsedPayload.picture ?? null,
      }
    );

    return next({
      ctx: {
        authUser: {
          ...auth0User,
          id: user.id,
        },
      },
    });
  } catch (error) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Invalid token.',
    });
  }
});