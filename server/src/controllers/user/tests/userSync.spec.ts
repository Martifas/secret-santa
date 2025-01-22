import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@server/utils/tests/transactions'
import { createTestDatabase } from '@server/utils/tests/database'
import { fakeUser } from '@server/entities/tests/fakes'
import { insertAll } from '@server/utils/tests/record'
import userRouter from '..'

const db = await wrapInRollbacks(createTestDatabase())
const AUTH0_ID = 'auth0|123456789'
const [userSeed] = await insertAll(db, 'user', [
  fakeUser({
    email: 'existing@user.com',
    auth0Id: AUTH0_ID,
  }),
])

describe('userSync', () => {
  it('should return existing user if auth0Id found', async () => {
    const caller = createCallerFactory(userRouter)({ db })
   
    const result = await caller.userSync({
      auth0Id: AUTH0_ID,
      email: 'existing@user.com',
      firstName: 'Test',
      lastName: 'User'
    })
   
    expect(result).toEqual({
      success: true,
      user: expect.objectContaining({
        id: userSeed.id,
        email: userSeed.email,
        auth0Id: AUTH0_ID
      })
    })
  })

  it('should create new user if auth0Id not found', async () => {
    const caller = createCallerFactory(userRouter)({ db })
    const newAuth0Id = 'auth0|newuser123'
    const newEmail = 'new@user.com'
   
    const result = await caller.userSync({
      auth0Id: newAuth0Id,
      email: newEmail,
      firstName: 'New',
      lastName: 'User'
    })
   
    expect(result).toEqual({
      success: true,
      user: expect.objectContaining({
        email: newEmail,
        auth0Id: newAuth0Id,
        firstName: 'New',
        lastName: 'User'
      })
    })
  })

  it('should throw an error for duplicate email', async () => {
    const caller = createCallerFactory(userRouter)({ db })
   
    await expect(
      caller.userSync({
        auth0Id: 'auth0|different',
        email: 'existing@user.com', // Using existing email
        firstName: 'Test',
        lastName: 'User'
      })
    ).rejects.toThrow(/email already exists/i)
  })
})