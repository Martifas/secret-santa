import type { UserRepository } from '@server/repositories/userRepository'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@tests/utils/context'
import type { UserForMember } from '@server/entities/user'
import userRouter from '..'

describe('login', () => {
 const loginInput = {
   email: 'test@example.com',
   auth0Id: 'auth0|test123',
 }

 const existingUser: UserForMember = {
   id: 1,
   email: loginInput.email,
   auth0Id: loginInput.auth0Id,
   firstName: null, 
   lastName: null,
   avatarUrl: null,
   createdAt: new Date(),
   lastLogin: new Date(Date.now() - 1000 * 60 * 60),
 }

 const newLoginTime = new Date()

 it('should update lastLogin for existing user', async () => {
   const repos = {
     userRepository: {
       findByAuth0Id: async () => existingUser,
       updateLastLogin: async (id) => ({
         ...existingUser,
         id,
         lastLogin: newLoginTime,
       }),
     } satisfies Partial<UserRepository>,
   }

   const testContext = authRepoContext(repos)
   const createCaller = createCallerFactory(userRouter)
   const { login } = createCaller(testContext)

   const result = await login(loginInput)

   expect(result).toMatchObject({
     ...existingUser,
     lastLogin: newLoginTime,
   })
 })

 it('should create new user if not found', async () => {
   const newUser: UserForMember = {
     id: 2,
     email: loginInput.email,
     auth0Id: loginInput.auth0Id,
     firstName: null,
     lastName: null,
     avatarUrl: null,
     createdAt: newLoginTime,
     lastLogin: newLoginTime,
   }

   const repos = {
     userRepository: {
       findByAuth0Id: async () => null,
       create: async () => newUser,
     } satisfies Partial<UserRepository>,
   }

   const testContext = authRepoContext(repos)
   const createCaller = createCallerFactory(userRouter)
   const { login } = createCaller(testContext)

   const result = await login(loginInput)

   expect(result).toMatchObject({
     ...newUser,
     createdAt: expect.any(Date),
     lastLogin: expect.any(Date),
   })
 })

 it('should propagate unknown errors from findByAuth0Id', async () => {
   const unknownError = new Error('Database connection failed')
   const repos = {
     userRepository: {
       findByAuth0Id: async () => {
         throw unknownError
       },
     } satisfies Partial<UserRepository>,
   }

   const testContext = authRepoContext(repos)
   const createCaller = createCallerFactory(userRouter)
   const { login } = createCaller(testContext)

   await expect(login(loginInput)).rejects.toThrow(unknownError)
 })

 it('should propagate unknown errors from create', async () => {
   const unknownError = new Error('Database connection failed')
   const repos = {
     userRepository: {
       findByAuth0Id: async () => null,
       create: async () => {
         throw unknownError
       },
     } satisfies Partial<UserRepository>,
   }

   const testContext = authRepoContext(repos)
   const createCaller = createCallerFactory(userRouter)
   const { login } = createCaller(testContext)

   await expect(login(loginInput)).rejects.toThrow(unknownError)
 })

 it('should propagate unknown errors from updateLastLogin', async () => {
   const unknownError = new Error('Database connection failed')
   const repos = {
     userRepository: {
       findByAuth0Id: async () => existingUser,
       updateLastLogin: async () => {
         throw unknownError
       },
     } satisfies Partial<UserRepository>,
   }

   const testContext = authRepoContext(repos)
   const createCaller = createCallerFactory(userRouter)
   const { login } = createCaller(testContext)

   await expect(login(loginInput)).rejects.toThrow(unknownError)
 })
})