// tokenPayload.ts
import { z } from 'zod';
import { authUserSchema, type AuthUser } from '../../entities/user';

export const auth0PayloadSchema = z.object({
  sub: z.string(),
  iss: z.string(),
  aud: z.union([z.string(), z.array(z.string())]),
  iat: z.number(),
  exp: z.number(),
  email: z.string().email().optional(),
  email_verified: z.boolean().optional(),
  name: z.string().optional(),
  given_name: z.string().optional(),
  family_name: z.string().optional(),
  picture: z.string().optional(),
});

export type Auth0Payload = z.infer<typeof auth0PayloadSchema>;

export function parseTokenPayload(payload: unknown): AuthUser {
  const auth0User = auth0PayloadSchema.parse(payload);  
  return authUserSchema.parse({
    id: auth0User.sub.replace('auth0|', ''),
    auth0Id: auth0User.sub
  });
}