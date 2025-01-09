import type { Database } from "../database";
import { eventRepository } from "./eventRepository";
import { wishlistRepository } from "./wishlistRepository";
import { invitationRepository } from "./invitationRepository";
import { ruleRepository } from "./ruleRepository";
import { userEventRepository } from "./userEventRepository";
import { userRepository } from "./userRepository";
export type RepositoryFactory = <T>(db: Database) => T;
declare const repositories: {
    eventRepository: typeof eventRepository;
    wishlistRepository: typeof wishlistRepository;
    invitationRepository: typeof invitationRepository;
    ruleRepository: typeof ruleRepository;
    userEventRepository: typeof userEventRepository;
    userRepository: typeof userRepository;
};
export type RepositoriesFactories = typeof repositories;
export type Repositories = {
    [K in keyof RepositoriesFactories]: ReturnType<RepositoriesFactories[K]>;
};
export type RepositoriesKeys = keyof Repositories;
export { repositories };
//# sourceMappingURL=index.d.ts.map