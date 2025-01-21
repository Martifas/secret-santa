import type { UserIdRowSelect } from "@server/types/userEvent";

export default async function assignSantas(eventMembers: UserIdRowSelect[]) {
  if (eventMembers.length < 2) return []

  const availableSantas = [...eventMembers]
  const assignments: Array<{ member: number; santa: number }> = []

  for (const member of eventMembers) {
    const validSantas = availableSantas.filter(
      (santa) => santa.userId !== member.userId
    )

    if (validSantas.length === 0) {
      return assignSantas(eventMembers)
    }

    const santaIndex = Math.floor(Math.random() * validSantas.length)
    const chosenSanta = validSantas[santaIndex]

    const santaRemovalIndex = availableSantas.findIndex(
      (santa) => santa.userId === chosenSanta.userId
    )
    availableSantas.splice(santaRemovalIndex, 1)

    assignments.push({
      member: member.userId,
      santa: chosenSanta.userId,
    })
  }

  return assignments
}
