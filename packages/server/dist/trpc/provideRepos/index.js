import { middleware } from '..';
const none = {};
export default function provideRepos(reposFactoriesWanted) {
    return middleware(({ ctx, next }) => {
        const reposAlreadyProvided = ctx.repos || none;
        const reposWantedTuples = Object.entries(reposFactoriesWanted);
        const reposWanted = Object.fromEntries(reposWantedTuples.map(([key, repoFactory]) => [
            key,
            reposAlreadyProvided[key] || repoFactory(ctx.db),
        ]));
        return next({
            ctx: {
                repos: {
                    ...reposAlreadyProvided,
                    ...reposWanted,
                },
            },
        });
    });
}
