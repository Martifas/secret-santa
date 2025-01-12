import bcrypt from 'bcrypt';
import { publicProcedure } from '../../trpc/index';
import provideRepos from '../../trpc/provideRepos';
import { userRepository } from '../../repositories/userRepository';
import { userSchema } from '../../entities/user';
import { prepareTokenPayload } from '../../trpc/tokenPayload';
import { TRPCError } from '@trpc/server';
import jsonwebtoken from 'jsonwebtoken';
import config from '../../config';
const { expiresIn, tokenKey } = config.auth;
export default publicProcedure
    .use(provideRepos({
    userRepository,
}))
    .input(userSchema.pick({
    email: true,
    password: true,
}))
    .mutation(async ({ input: { email, password }, ctx: { repos } }) => {
    const user = await repos.userRepository.findByEmail(email);
    if (!user) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'We could not find an account with this email address',
        });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Incorrect password. Please try again.',
        });
    }
    const payload = prepareTokenPayload(user);
    const accessToken = jsonwebtoken.sign(payload, tokenKey, {
        expiresIn,
    });
    return {
        accessToken,
    };
});
