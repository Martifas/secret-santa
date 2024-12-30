import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll } from '@tests/utils/record'
import { fakeUser } from '@server/entities/tests/fakes'
import { pick } from 'lodash-es'
import { userEventKeysForTesting } from '@server/entities/userEvent'
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

    expect(foundUser).not.toBeUndefined()
    if (!foundUser) throw new Error('No user found')

    expect(pick(foundUser, userEventKeysForTesting)).toEqual(
      pick(userOne, userEventKeysForTesting)
    )
  })

  it('should return null for non-existent user', async () => {
    const foundUser = await repository.findByEmail('medis@miskas.lt')
    expect(foundUser).toBeUndefined()
  })
})

describe('create', () => {
  it('should create a new user', async () => {
    const user = fakeUserDefault()

    const createdUser = await repository.create(user)

    expect(createdUser).toMatchObject({
      ...pick(user, userKeysForTesting),
      id: expect.any(Number),
    })
  })
})
