/* eslint-disable @typescript-eslint/no-explicit-any */
import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@server/utils/tests/transactions'
import { createTestDatabase } from '@server/utils/tests/database'
import { fakeUser } from '@server/entities/tests/fakes'
import { insertAll } from '@server/utils/tests/record'
import userRouter from '..'

const db = await wrapInRollbacks(createTestDatabase())
const PASSWORD_CORRECT = 'password.123'

const [userSeed] = await insertAll(db, 'user', [
  fakeUser({
    email: 'existing@user.com',
    password: '$2b$10$sD53fzWIQBjXWfSDzuwmMOyY1ZAygLpRZlLxxPhcNG5r9BFWrNaDC',
  }),
])

const createMockRes = () => {
  const cookies: Record<string, any> = {}
  return {
    cookie: (name: string, value: string, options: any) => {
      cookies[name] = { value, options }
    },
    getCookies: () => cookies,
  }
}

describe('login', () => {
  it('sets cookies if the password matches', async () => {
    const mockRes = createMockRes()
    const caller = createCallerFactory(userRouter)({
      db,
      res: mockRes,
    } as any)

    const result = await caller.login({
      email: userSeed.email,
      password: PASSWORD_CORRECT,
    })

    expect(result).toEqual({ success: true })

    const cookies = mockRes.getCookies()
    expect(cookies.access_token).toBeDefined()
    expect(cookies.access_token.value).toEqual(expect.any(String))
    expect(cookies.access_token.value.slice(0, 3)).toEqual('eyJ')
    expect(cookies.access_token.options).toMatchObject({
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 30 * 60 * 1000,
    })
  })

  it('should throw an error for non-existent user', async () => {
    const mockRes = createMockRes()
    const caller = createCallerFactory(userRouter)({
      db,
      res: mockRes,
    } as any)

    await expect(
      caller.login({
        email: 'nonexisting@user.com',
        password: PASSWORD_CORRECT,
      })
    ).rejects.toThrow()
  })

  it('should throw an error for incorrect password', async () => {
    const mockRes = createMockRes()
    const caller = createCallerFactory(userRouter)({
      db,
      res: mockRes,
    } as any)

    await expect(
      caller.login({
        email: userSeed.email,
        password: 'password.123!',
      })
    ).rejects.toThrow(/password/i)
  })

  it('throws an error for invalid email', async () => {
    const mockRes = createMockRes()
    const caller = createCallerFactory(userRouter)({
      db,
      res: mockRes,
    } as any)

    await expect(
      caller.login({
        email: 'not-an-email',
        password: PASSWORD_CORRECT,
      })
    ).rejects.toThrow(/email/)
  })

  it('throws an error for a short password', async () => {
    const mockRes = createMockRes()
    const caller = createCallerFactory(userRouter)({
      db,
      res: mockRes,
    } as any)

    await expect(
      caller.login({
        email: userSeed.email,
        password: 'short',
      })
    ).rejects.toThrow(/password/)
  })
})
