import type { Database } from "@server/database"
import { eventRepository } from "./eventRepository"
import { wishlistRepository } from "./wishlistRepository"
import { invitationRepository } from "./invitationRepository"
import { ruleRepository } from "./ruleRepository"
import { userEventRepository } from "./userEventRepository"
import { userRepository } from "./userRepository"

export type RepositoryFactory = <T>(db: Database) => T

const repositories = { eventRepository, wishlistRepository, invitationRepository, ruleRepository, userEventRepository, userRepository }

export type RepositoriesFactories = typeof repositories
export type Repositories = {
  [K in keyof RepositoriesFactories]: ReturnType<RepositoriesFactories[K]>
}
export type RepositoriesKeys = keyof Repositories

export { repositories }
