/* eslint-disable @typescript-eslint/no-explicit-any */
import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@server/utils/tests/transactions'
import { createTestDatabase } from '@server/utils/tests/database'
import userRouter from '..'

const db = await wrapInRollbacks(createTestDatabase())

const createMockRes = () => {
  const clearedCookies: string[] = []
  return {
    clearCookie: (name: string) => {
      clearedCookies.push(name)
    },
    getClearedCookies: () => clearedCookies,
  }
}

describe('logout', () => {
  it('should clear the access token cookie', async () => {
    const mockRes = createMockRes()
    const caller = createCallerFactory(userRouter)({
      db,
      res: mockRes,
    } as any)

    const result = await caller.logout()

    expect(result).toEqual({ success: true })
    expect(mockRes.getClearedCookies()).toContain('access_token')
  })

  it('should throw an error when response object is missing', async () => {
    const caller = createCallerFactory(userRouter)({
      db,
    } as any)

    await expect(caller.logout()).rejects.toThrow('Missing response object')
  })
})
