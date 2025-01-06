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
  })

describe('find', () => {
  it('should return a user by email', async () => {
    const foundUser = await repository.findByEmail(userOne.email)
    expect(foundUser).not.toBeNull()
    if (!foundUser) throw new Error('No user found')
    expect(pick(foundUser, userKeysForTesting)).toEqual(
      pick(userOne, userKeysForTesting)
    )
  })

  it('should return null for non-existent user', async () => {
    const foundUser = await repository.findByEmail('medis@miskas.lt')
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
    const createdUser = await repository.create(user)
    expect(createdUser).toMatchObject({
      ...pick(user, userKeysForTesting),
      id: expect.any(Number),
      createdAt: expect.any(Date),
      lastLogin: expect.any(Date),
    })
  })
})

describe('updateProfile', () => {
  it('should update user profile', async () => {
    const updates = {
      firstName: 'Updated',
      lastName: 'Name',
      avatarUrl: 'https://example.com/new.jpg',
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
      avatarUrl: userOne.avatarUrl,
    })
  })

  it('should throw error for non-existent user', async () => {
    await expect(
      repository.updateProfile(99999, { firstName: 'Test' })
    ).rejects.toThrowError(/no result/i)
  })
})
