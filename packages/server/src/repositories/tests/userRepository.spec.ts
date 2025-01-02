import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll } from '@tests/utils/record'
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

  it('should find user by auth0Id', async () => {
    const foundUser = await repository.findByAuth0Id(userOne.auth0Id)
    expect(foundUser).not.toBeNull()
    if (!foundUser) throw new Error('No user found')
    expect(pick(foundUser, userKeysForTesting)).toEqual(
      pick(userOne, userKeysForTesting)
    )
  })

  it('should return null for non-existent auth0Id', async () => {
    const foundUser = await repository.findByAuth0Id('auth0|nonexistent')
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

describe('findOrCreateFromAuth0', () => {
  const auth0Id = 'auth0|test123'
  const email = 'test@example.com'
  const profile = {
    firstName: 'John',
    lastName: 'Doe',
    avatarUrl: 'https://example.com/avatar.jpg'
  }

  it('should create new user from Auth0 data', async () => {
    const user = await repository.findOrCreateFromAuth0(auth0Id, email, profile)
    
    expect(user).toMatchObject({
      auth0Id,
      email,
      ...profile,
      id: expect.any(Number),
      createdAt: expect.any(Date),
      lastLogin: expect.any(Date),
    })
  })

  it('should return existing user and update lastLogin', async () => {
 
    const createdUser = await repository.findOrCreateFromAuth0(auth0Id, email, profile)
  
    await new Promise(resolve => {setTimeout(resolve, 1000)})
    
 
    const foundUser = await repository.findOrCreateFromAuth0(auth0Id, email)
    
    expect(foundUser.id).toBe(createdUser.id)
    expect(foundUser.lastLogin.getTime()).toBeGreaterThan(createdUser.lastLogin.getTime())
  })

  it('should update profile when finding existing user', async () => {
    await repository.findOrCreateFromAuth0(auth0Id, email, profile)
     
    const newProfile = {
      firstName: 'Jane',
      lastName: 'Smith',
      avatarUrl: 'https://example.com/new-avatar.jpg'
    }
    
    const updatedUser = await repository.findOrCreateFromAuth0(auth0Id, email, newProfile)
    
    expect(updatedUser).toMatchObject({
      ...newProfile,
      auth0Id,
      email,
    })
  })
})

describe('updateProfile', () => {
  it('should update user profile', async () => {
    const updates = {
      firstName: 'Updated',
      lastName: 'Name',
      avatarUrl: 'https://example.com/new.jpg'
    }

    const updatedUser = await repository.updateProfile(userOne.id, updates)
    
    expect(updatedUser).toMatchObject({
      ...updates,
      id: userOne.id,
      email: userOne.email,
      auth0Id: userOne.auth0Id,
    })
  })

  it('should allow partial updates', async () => {
    const updates = {
      firstName: 'Partial'
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