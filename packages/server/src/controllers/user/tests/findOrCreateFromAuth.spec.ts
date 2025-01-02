import { fakeAuthUser } from '@server/entities/tests/fakes'
import type { UserRepository } from '@server/repositories/userRepository'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@tests/utils/context'
import type { UserForMember } from '@server/entities/user'
import userRouter from '..'

describe('findOrCreateFromAuth', () => {
 const TEST_USER = fakeAuthUser({
   id: 1,
   auth0Id: 'auth0|test123',
 })

 const authInput = {
   auth0Id: 'auth0|new123',
   email: 'new@example.com',
   firstName: 'John',
   lastName: 'Doe',
   avatarUrl: 'https://example.com/avatar.jpg',
 }

 const existingUser: UserForMember = {
   id: 2,
   auth0Id: authInput.auth0Id,
   email: authInput.email,
   firstName: authInput.firstName,
   lastName: authInput.lastName,
   avatarUrl: authInput.avatarUrl,
   createdAt: new Date(),
   lastLogin: new Date(),
 }

 it('should find existing user with profile', async () => {
   const repos = {
     userRepository: {
       findOrCreateFromAuth0: async (auth0Id, email, profile) => {
         expect(auth0Id).toBe(authInput.auth0Id)
         expect(email).toBe(authInput.email)
         expect(profile).toEqual({
           firstName: authInput.firstName,
           lastName: authInput.lastName,
           avatarUrl: authInput.avatarUrl,
         })
         return existingUser
       },
     } satisfies Partial<UserRepository>,
   }

   const testContext = authRepoContext(repos, TEST_USER)
   const createCaller = createCallerFactory(userRouter)
   const { findOrCreateFromAuth } = createCaller(testContext)

   const result = await findOrCreateFromAuth(authInput)

   expect(result).toEqual(existingUser)
 })

 it('should handle input without optional fields', async () => {
   const minimalInput = {
     auth0Id: authInput.auth0Id,
     email: authInput.email,
   }

   const minimalUser: UserForMember = {
     id: 2,
     auth0Id: minimalInput.auth0Id,
     email: minimalInput.email,
     firstName: null,
     lastName: null,
     avatarUrl: null,
     createdAt: new Date(),
     lastLogin: new Date(),
   }

   const repos = {
     userRepository: {
       findOrCreateFromAuth0: async (auth0Id, email, profile) => {
         expect(auth0Id).toBe(minimalInput.auth0Id)
         expect(email).toBe(minimalInput.email)
         expect(profile).toBeUndefined()
         return minimalUser
       },
     } satisfies Partial<UserRepository>,
   }

   const testContext = authRepoContext(repos, TEST_USER)
   const createCaller = createCallerFactory(userRouter)
   const { findOrCreateFromAuth } = createCaller(testContext)

   const result = await findOrCreateFromAuth(minimalInput)

   expect(result).toEqual(minimalUser)
 })

 it('should handle partial profile fields', async () => {
   const partialInput = {
     auth0Id: authInput.auth0Id,
     email: authInput.email,
     firstName: 'John',

   }

   const partialUser: UserForMember = {
     id: 2,
     auth0Id: partialInput.auth0Id,
     email: partialInput.email,
     firstName: partialInput.firstName,
     lastName: null,
     avatarUrl: null,
     createdAt: new Date(),
     lastLogin: new Date(),
   }

   const repos = {
     userRepository: {
       findOrCreateFromAuth0: async (auth0Id, email, profile) => {
         expect(auth0Id).toBe(partialInput.auth0Id)
         expect(email).toBe(partialInput.email)
         expect(profile).toEqual({
           firstName: partialInput.firstName,
           lastName: undefined,
           avatarUrl: undefined,
         })
         return partialUser
       },
     } satisfies Partial<UserRepository>,
   }

   const testContext = authRepoContext(repos, TEST_USER)
   const createCaller = createCallerFactory(userRouter)
   const { findOrCreateFromAuth } = createCaller(testContext)

   const result = await findOrCreateFromAuth(partialInput)

   expect(result).toEqual(partialUser)
 })

 it('should propagate unknown errors', async () => {
   const unknownError = new Error('Database connection failed')
   const repos = {
     userRepository: {
       findOrCreateFromAuth0: async () => {
         throw unknownError
       },
     } satisfies Partial<UserRepository>,
   }

   const testContext = authRepoContext(repos, TEST_USER)
   const createCaller = createCallerFactory(userRouter)
   const { findOrCreateFromAuth } = createCaller(testContext)

   await expect(findOrCreateFromAuth(authInput)).rejects.toThrow(unknownError)
 })
})