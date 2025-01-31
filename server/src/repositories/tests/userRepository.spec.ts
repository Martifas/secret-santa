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

describe('updateProfile', () => {
  it('should update user profile', async () => {
    const updates = {
      firstName: 'Updated',
      lastName: 'Name',
      picture: 'https://example.com/new.jpg',
    }

    const updatedUser = await repository.updateProfile(userOne.id, updates)

    expect(updatedUser).toMatchObject({
      ...updates,
      id: userOne.id,
      email: userOne.email,
    })
  })

  it('should update user email', async () => {
    const updates = {
      email: 'test@email.com',
    }

    const updatedUser = await repository.updateEmail(userOne.id, updates)

    expect(updatedUser).toMatchObject({
      ...userOne,
      ...updates,
    })
  })

  it('should allow partial updates', async () => {
    const updates = {
      firstName: 'Partial',
    }

    const updatedUser = await repository.updateProfile(userOne.id, updates)

    expect(updatedUser).toMatchObject({
      ...updates,
      id: userOne.id,
      lastName: userOne.lastName,
      picture: userOne.picture,
    })
  })

  it('should throw error for non-existent user', async () => {
    await expect(
      repository.updateProfile(99999, { firstName: 'Test' })
    ).rejects.toThrowError(/no result/i)
  })
})
