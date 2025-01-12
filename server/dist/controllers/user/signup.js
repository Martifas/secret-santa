import { publicProcedure } from '../../trpc/index';
import provideRepos from '../../trpc/provideRepos';
import { userRepository } from '../../repositories/userRepository';
import { userSchema } from '../../entities/user';
import { TRPCError } from '@trpc/server';
import { hash } from 'bcrypt';
import config from '../../config';
import { assertError } from '../../utils/errors';
export default publicProcedure
    .use(provideRepos({
    userRepository,
}))
    .input(userSchema.pick({
    email: true,
    password: true,
    firstName: true,
    lastName: true,
}))
    .mutation(async ({ input: user, ctx: { repos } }) => {
    const passwordHash = await hash(user.password, config.auth.passwordCost);
    const userCreated = await repos.userRepository
        .create({
        ...user,
        email: user.email.toLowerCase(),
        password: passwordHash,
    })
        .catch((error) => {
        assertError(error);
        if (error.message.includes('duplicate key')) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'User with this email already exists',
                cause: error,
            });
        }
        throw error;
    });
    return {
        id: userCreated.id,
    };
});
