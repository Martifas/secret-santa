import type { UserRepository } from '@server/repositories/userRepository'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@tests/utils/context'
import { TRPCError } from '@trpc/server'
import type { UserForMember } from '@server/entities/user'
import userRouter from '..'

describe('signup', () => {
  const newUserInput = {
    email: 'new@example.com',
    auth0Id: 'auth0|new123',
    firstName: 'John',
    lastName: 'Doe',
    avatarUrl: 'https://example.com/avatar.jpg',
  }

  const createdUser: UserForMember = {
    id: 1,
    email: newUserInput.email,
    auth0Id: newUserInput.auth0Id,
    firstName: newUserInput.firstName,
    lastName: newUserInput.lastName,
    avatarUrl: newUserInput.avatarUrl,
    createdAt: new Date(),
    lastLogin: new Date(),
  }

  it('should create a new user when email is not in use', async () => {
    const repos = {
      userRepository: {
        create: async (input): Promise<UserForMember> => {
          expect(input).toMatchObject(newUserInput)
          return createdUser
        },
        findByEmail: async () => null,
      } satisfies Partial<UserRepository>,
    }

    const testContext = authRepoContext(repos)
    const createCaller = createCallerFactory(userRouter)
    const { signup } = createCaller(testContext)

    const result = await signup(newUserInput)

    expect(result).toMatchObject({
      id: expect.any(Number),
      email: newUserInput.email,
      auth0Id: newUserInput.auth0Id,
      firstName: newUserInput.firstName,
      lastName: newUserInput.lastName,
      avatarUrl: newUserInput.avatarUrl,
      createdAt: expect.any(Date),
      lastLogin: expect.any(Date),
    })
  })

  it('should allow partial input with only required fields', async () => {
    const minimalInput = {
      email: 'minimal@example.com',
      auth0Id: 'auth0|minimal123',
    }

    const minimalCreatedUser: UserForMember = {
      id: 2,
      email: minimalInput.email,
      auth0Id: minimalInput.auth0Id,
      firstName: null,
      lastName: null,
      avatarUrl: null,
      createdAt: new Date(),
      lastLogin: new Date(),
    }

    const repos = {
      userRepository: {
        create: async (): Promise<UserForMember> => minimalCreatedUser,
        findByEmail: async () => null,
      } satisfies Partial<UserRepository>,
    }

    const testContext = authRepoContext(repos)
    const createCaller = createCallerFactory(userRouter)
    const { signup } = createCaller(testContext)

    const result = await signup(minimalInput)

    expect(result).toMatchObject({
      id: expect.any(Number),
      email: minimalInput.email,
      auth0Id: minimalInput.auth0Id,
      firstName: null,
      lastName: null,
      avatarUrl: null,
      createdAt: expect.any(Date),
      lastLogin: expect.any(Date),
    })
  })

  it('should throw BAD_REQUEST when email is already in use', async () => {
    const repos = {
      userRepository: {
        create: async (): Promise<UserForMember> => {
          throw new Error('Should not be called')
        },
        findByEmail: async () => createdUser,
      } satisfies Partial<UserRepository>,
    }

    const testContext = authRepoContext(repos)
    const createCaller = createCallerFactory(userRouter)
    const { signup } = createCaller(testContext)

    await expect(signup(newUserInput)).rejects.toThrow(
      new TRPCError({
        code: 'BAD_REQUEST',
        message: 'User with this email already exists',
      })
    )
  })

  it('should propagate unknown errors', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      userRepository: {
        create: async (): Promise<UserForMember> => {
          throw unknownError
        },
        findByEmail: async () => null,
      } satisfies Partial<UserRepository>,
    }

    const testContext = authRepoContext(repos)
    const createCaller = createCallerFactory(userRouter)
    const { signup } = createCaller(testContext)

    await expect(signup(newUserInput)).rejects.toThrow(unknownError)
  })
})