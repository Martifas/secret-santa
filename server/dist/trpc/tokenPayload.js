import { authUserSchema } from '../entities/user';
import { z } from 'zod';
const tokenPayloadSchema = z.object({
    user: authUserSchema,
});
export function prepareTokenPayload(user) {
    return tokenPayloadSchema.parse({ user });
}
export function parseTokenPayload(tokenVerified) {
    return tokenPayloadSchema.parse(tokenVerified);
}
