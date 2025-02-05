import { userEventSchema } from '@server/entities/userEvent'
import { userEventRepository } from '@server/repositories/userEventRepository'
import { eventRepository } from '@server/repositories/eventRepository'
import { userRepository } from '@server/repositories/userRepository'
import assignSantas from '@server/services/assignSantas'
import { sendSecretSantaDrawResult } from '@server/services/sendEmail'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .use(
    provideRepos({
      userEventRepository,
      eventRepository,
      userRepository,
    })
  )
  .input(
    userEventSchema.pick({
      eventId: true,
    })
  )
  .mutation(
    async ({
      input,
      ctx: { repos },
    }): Promise<{
      message: string
      success: boolean
      totalAssignments: number
      emailsSent: number
    }> => {
      const eventMembers = await repos.userEventRepository.getAllEventUsers(
        input.eventId
      )
      if (eventMembers.length < 3) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Not enough members to assign secret santas. Minimum 3 members required.',
        })
      }

      const event = await repos.eventRepository.find(input.eventId)
      if (!event) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Event not found',
        })
      }

      const organizer = await repos.userRepository.findNamePicEmailByAuth0Id(
        event.createdBy
      )
      if (!organizer) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Event organizer not found',
        })
      }

      const assignments = await assignSantas(eventMembers)

      await Promise.all(
        assignments.map(async ({ member, santa }) => {
          await repos.userEventRepository.updateSecretSanta(
            member,
            santa,
            input.eventId
          )

          const santaDetails =
            await repos.userRepository.findNamePicEmailByAuth0Id(santa)
          if (!santaDetails?.email) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: `Santa's email not found for user ${santa}`,
            })
          }

          const gifteeDetails =
            await repos.userRepository.findNamePicEmailByAuth0Id(member)
          if (!gifteeDetails?.firstName) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: `Giftee's name not found for user ${member}`,
            })
          }

          const eventLink = `/events/${input.eventId}`

          await sendSecretSantaDrawResult({
            emailReceiver: santaDetails.email,
            eventOrganiser: organizer.firstName || 'Event Organizer',
            gifteeName: gifteeDetails.firstName,
            eventLink,
            exchangeDate: event.eventDate,
            budgetLimit: event.budgetLimit,
            title: event.title,
          })
        })
      )

      return {
        message: `Secret santas for all ${assignments.length} members assigned`,
        success: true,
        totalAssignments: assignments.length,
        emailsSent: assignments.length,
      }
    }
  )
