import assignSantas from '@server/utils/assignSantas'
import type { UserIdRowSelect } from '@server/types/userEvent'

describe('assignSantas', () => {
  const createMembers = (userIds: number[]): UserIdRowSelect[] => 
    userIds.map(id => ({ userId: id }))

  it('should assign santas to all members', async () => {
    const members = createMembers([1, 2, 3, 4])
    const assignments = await assignSantas(members)

    expect(assignments).toHaveLength(members.length)
  })

  it('should ensure no member is their own santa', async () => {
    const members = createMembers([1, 2, 3, 4])
    const assignments = await assignSantas(members)

    assignments.forEach(({ member, santa }) => {
      expect(member).not.toBe(santa)
    })
  })

  it('should ensure each member is a santa exactly once and has exactly one santa', async () => {
    const members = createMembers([1, 2, 3, 4])
    const assignments = await assignSantas(members)

    const santaCounts = new Map<number, number>()
    assignments.forEach(({ santa }) => {
      santaCounts.set(santa, (santaCounts.get(santa) || 0) + 1)
    })

    members.forEach(({ userId }) => {
      expect(santaCounts.get(userId)).toBe(1)
    })

    const memberCounts = new Map<number, number>()
    assignments.forEach(({ member }) => {
      memberCounts.set(member, (memberCounts.get(member) || 0) + 1)
    })

    members.forEach(({ userId }) => {
      expect(memberCounts.get(userId)).toBe(1)
    })
  })

  it('should work with minimum number of members (3)', async () => {
    const members = createMembers([1, 2, 3])
    const assignments = await assignSantas(members)

    expect(assignments).toHaveLength(3)
    assignments.forEach(({ member, santa }) => {
      expect(member).not.toBe(santa)
    })
  })

  it('should handle empty array', async () => {
    const assignments = await assignSantas([])
    expect(assignments).toEqual([])
  })

  it('should handle single member', async () => {
    const members = createMembers([1])
    const assignments = await assignSantas(members)
    expect(assignments).toEqual([])
  })
})