/* eslint-disable @typescript-eslint/no-explicit-any */
import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@server/utils/tests/transactions'
import { createTestDatabase } from '@server/utils/tests/database'
import { fakeUser } from '@server/entities/tests/fakes'
import { insertAll } from '@server/utils/tests/record'
import userRouter from '..'

const createCaller = createCallerFactory(userRouter)
const db = await wrapInRollbacks(createTestDatabase())
const PASSWORD_CORRECT = 'password.123'

const [userSeed] = await insertAll(db, 'user', [
  fakeUser({
    email: 'existing@user.com',
    password: '$2b$10$sD53fzWIQBjXWfSDzuwmMOyY1ZAygLpRZlLxxPhcNG5r9BFWrNaDC',
  }),
])

const { login } = createCaller({ db } as any)

it('returns a token if the password matches', async () => {
  const { accessToken } = await login({
    email: userSeed.email,
    password: PASSWORD_CORRECT,
  })

  expect(accessToken).toEqual(expect.any(String))
  expect(accessToken.slice(0, 3)).toEqual('eyJ')
})

it('should throw an error for non-existant user', async () => {
  await expect(
    login({
      email: 'nonexisting@user.com',
      password: PASSWORD_CORRECT,
    })
  ).rejects.toThrow()
})

it('should throw an error for incorrect password', async () => {
  await expect(
    login({
      email: userSeed.email,
      password: 'password.123!',
    })
  ).rejects.toThrow(/password/i)
})

it('throws an error for invalid email', async () => {
  await expect(
    login({
      email: 'not-an-email',
      password: PASSWORD_CORRECT,
    })
  ).rejects.toThrow(/email/)
})

it('throws an error for a short password', async () => {
  await expect(
    login({
      email: userSeed.email,
      password: 'short',
    })
  ).rejects.toThrow(/password/)
})
