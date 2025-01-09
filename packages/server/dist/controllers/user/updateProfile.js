import provideRepos from '../../trpc/provideRepos';
import { userRepository } from '../../repositories/userRepository';
import { userSchema } from '../../entities/user';
import { TRPCError } from '@trpc/server';
import { authenticatedProcedure } from '../../trpc/authenticatedProcedure';
export default authenticatedProcedure
    .use(provideRepos({
    userRepository,
}))
    .input(userSchema
    .pick({
    firstName: true,
    lastName: true,
    avatarUrl: true,
})
    .partial())
    .mutation(async ({ input, ctx: { repos, authUser } }) => {
    const user = await repos.userRepository.findById(authUser.id);
    if (!user) {
        throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
        });
    }
    return repos.userRepository.updateProfile(user.id, input);
});
