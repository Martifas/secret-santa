import { createCallerFactory } from '@server/trpc'
import { createTestDatabase } from '@server/utils/tests/database'
import { wrapInRollbacks } from '@server/utils/tests/transactions'
import { fakeUser } from '@server/entities/tests/fakes'
import { selectAll } from '@server/utils/tests/record'
import userRouter from '..'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = createCallerFactory(userRouter)
const { signup } = createCaller({ db })

it('should save a user', async () => {
  const user = fakeUser()
  const response = await signup({
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    auth0Id: 'auth0|123456789'
  })
  
  const [userCreated] = await selectAll(db, 'user', (eb) =>
    eb('auth0Id', '=', 'auth0|123456789')
  )
  
  expect(userCreated).toMatchObject({
    id: expect.any(Number),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    auth0Id: 'auth0|123456789'
  })
  expect(response).toEqual(`User with ${userCreated.id} created`)
})

it('should require a valid email', async () => {
  await expect(
    signup({
      ...fakeUser(),
      auth0Id: 'auth0|123456789',
      email: 'user-email-invalid'
    })
  ).rejects.toThrow(/email/i)
})

it('stores lowercased email', async () => {
  const user = fakeUser()
  const auth0Id = 'auth0|123456789'
  
  await signup({
    ...user,
    auth0Id,
    email: user.email.toUpperCase()
  })
  
  const [userSaved] = await selectAll(db, 'user', (eb) =>
    eb('auth0Id', '=', auth0Id)
  )
  
  expect(userSaved.email).toBe(user.email.toLowerCase())
})

it('throws an error for duplicate email', async () => {
  const email = 'duplicate@example.com'
  const auth0Id1 = 'auth0|123456789'
  const auth0Id2 = 'auth0|987654321'
  
  await signup({
    ...fakeUser(),
    email,
    auth0Id: auth0Id1
  })
  
  await expect(
    signup({
      ...fakeUser(),
      email,
      auth0Id: auth0Id2
    })
  ).rejects.toThrow(/email already exists/i)
})