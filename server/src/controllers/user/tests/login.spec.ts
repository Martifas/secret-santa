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

describe('login', () => {
  it('should find user by auth0Id', async () => {
    const caller = createCallerFactory(userRouter)({ db })
    
    const result = await caller.login({
      auth0Id: AUTH0_ID,
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

  it('should throw an error for non-existent auth0Id', async () => {
    const caller = createCallerFactory(userRouter)({ db })
    
    await expect(
      caller.login({
        auth0Id: 'auth0|nonexistent'
      })
    ).rejects.toThrow(/not found/i)
  })
})