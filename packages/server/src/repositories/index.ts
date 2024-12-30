import type { Database } from "@server/database"
import { eventRepository } from "./eventRepository"
import { wishlistRepository } from "./wishlistRepository"

export type RepositoryFactory = <T>(db: Database) => T

// index of all repositories for provideRepos
const repositories = { eventRepository, wishlistRepository }

export type RepositoriesFactories = typeof repositories
export type Repositories = {
  [K in keyof RepositoriesFactories]: ReturnType<RepositoriesFactories[K]>
}
export type RepositoriesKeys = keyof Repositories

export { repositories }
