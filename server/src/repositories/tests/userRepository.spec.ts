import { createTestDatabase } from '@server/utils/tests/database'
import { wrapInRollbacks } from '@server/utils/tests/transactions'
import { insertAll } from '@server/utils/tests/record'
import { fakeUser } from '@server/entities/tests/fakes'
import { pick } from 'lodash-es'
import { userKeysForTesting } from '@server/entities/user'
import { userRepository } from '../userRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = userRepository(db)
const [userOne] = await insertAll(db, 'user', fakeUser())

const fakeUserDefault = (user: Parameters<typeof fakeUser>[0] = {}) =>
  fakeUser({
    ...user,
    auth0Id: 'auth0 | 1234',
  })

describe('find', () => {
  it('should return a user by auth0 id', async () => {
    const foundUser = await repository.findByAuth0Id(userOne.auth0Id)
    expect(foundUser).not.toBeNull()
    if (!foundUser) throw new Error('No user found')
    expect(pick(foundUser, userKeysForTesting)).toEqual(
      pick(userOne, userKeysForTesting)
    )
  })

  it('should return null for non-existent user', async () => {
    const foundUser = await repository.findByAuth0Id('google | 123')
    expect(foundUser).toBeNull()
  })

  it('should find user by id', async () => {
    const foundUser = await repository.findById(userOne.id)
    expect(foundUser).not.toBeNull()
    if (!foundUser) throw new Error('No user found')
    expect(pick(foundUser, userKeysForTesting)).toEqual(
      pick(userOne, userKeysForTesting)
    )
  })

  it('should return null for non-existent id', async () => {
    const foundUser = await repository.findById(999999)
    expect(foundUser).toBeNull()
  })

  it('should find user by id', async () => {
    const foundUser = await repository.findById(userOne.id)
    expect(foundUser).not.toBeNull()
    if (!foundUser) throw new Error('No user found')
    expect(pick(foundUser, userKeysForTesting)).toEqual(
      pick(userOne, userKeysForTesting)
    )
  })
})

describe('create', () => {
  it('should create a new user', async () => {
    const user = fakeUserDefault()
    const createdId = await repository.create(user)
    const createdUser = await repository.findById(createdId)
    expect(createdUser).not.toBeNull()
    if (!createdUser) throw new Error('No user found')
    expect(createdUser.auth0Id).toEqual(user.auth0Id)
  })
})

describe('findNamePicEmailByAuth0Id', () => {
  it('should return user details by auth0 id', async () => {
    const details = await repository.findNamePicEmailByAuth0Id(userOne.auth0Id)
    expect(details).toEqual({
      firstName: userOne.firstName,
      picture: userOne.picture,
      email: userOne.email,
    })
  })

  it('should return null values for non-existent user', async () => {
    const details =
      await repository.findNamePicEmailByAuth0Id('non-existent-id')
    expect(details).toEqual({
      firstName: null,
      picture: null,
      email: null,
    })
  })

  it('should handle user with missing optional fields', async () => {
    const [userWithMissingFields] = await insertAll(db, 'user', [
      fakeUser({
        firstName: null,
        picture: null,
      }),
    ])

    const details = await repository.findNamePicEmailByAuth0Id(
      userWithMissingFields.auth0Id
    )
    expect(details).toEqual({
      firstName: null,
      picture: null,
      email: userWithMissingFields.email,
    })
  })
})

describe('updateLastLogin', () => {
  it('should update lastLogin timestamp', async () => {
    const originalUser = await repository.findById(userOne.id)
    expect(originalUser).not.toBeNull()
    if (!originalUser) throw new Error('No user found')

    const originalLogin = originalUser.lastLogin

    await new Promise((resolve) => setTimeout(resolve, 10))

    const updatedUser = await repository.updateLastLogin(userOne.id)
    expect(updatedUser.lastLogin.getTime()).toBeGreaterThan(
      originalLogin.getTime()
    )
  })

  it('should throw error when updating non-existent user', async () => {
    await expect(repository.updateLastLogin(99999)).rejects.toThrowError(
      /no result/i
    )
  })

  it('should return full user object after update', async () => {
    const updatedUser = await repository.updateLastLogin(userOne.id)
    expect(updatedUser).toMatchObject({
      ...pick(userOne, userKeysForTesting),
      lastLogin: expect.any(Date),
    })
  })
})

describe('create', () => {
  it('should create user with minimum required fields', async () => {
    const minimalUser = {
      auth0Id: 'auth0|minimal',
      email: 'minimal@example.com',
    }

    const createdId = await repository.create(minimalUser)
    const createdUser = await repository.findById(createdId)
    expect(createdUser).not.toBeNull()
    if (!createdUser) throw new Error('No user found')

    expect(createdUser).toMatchObject({
      ...minimalUser,
      createdAt: expect.any(Date),
      lastLogin: expect.any(Date),
    })
  })

  it('should create user with all fields', async () => {
    const fullUser = {
      auth0Id: 'auth0|full',
      email: 'full@example.com',
      firstName: 'John',
      lastName: 'Doe',
      picture: 'https://example.com/pic.jpg',
    }

    const createdId = await repository.create(fullUser)
    const createdUser = await repository.findById(createdId)
    expect(createdUser).not.toBeNull()
    if (!createdUser) throw new Error('No user found')

    expect(createdUser).toMatchObject({
      ...fullUser,
      createdAt: expect.any(Date),
      lastLogin: expect.any(Date),
    })
  })
})

describe('find', () => {
  it('should find user by id', async () => {
    const foundUser = await repository.findById(userOne.id)
    expect(foundUser).not.toBeNull()
    if (!foundUser) throw new Error('No user found')
    expect(pick(foundUser, userKeysForTesting)).toEqual(
      pick(userOne, userKeysForTesting)
    )
  })
})
