import provideRepos from '@server/trpc/provideRepos'
import { eventInvitationSchema } from '@server/entities/eventInvitation'
import { invitationRepository } from '@server/repositories/invitationRepository'
import { TRPCError } from '@trpc/server'
import { sendGiftExchangeInvitation } from '@server/services/sendEmail'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { logger } from '@server/logger'
import { z } from 'zod'

const emailDataSchema = z.object({
  eventOrganiser: z.string(),
  eventDate: z.date(),
  title: z.string(),
  budgetLimit: z.number(),
  description: z.string(),
})

const invitationInputSchema = eventInvitationSchema
  .omit({
    id: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
  })
  .merge(emailDataSchema)

export default authenticatedProcedure
  .use(
    provideRepos({
      invitationRepository,
    })
  )
  .input(invitationInputSchema)
  .mutation(async ({ input, ctx: { repos } }) => {
    try {
      const existing = await repos.invitationRepository.findByEventAndEmail(
        input.eventId,
        input.email
      )

      if (existing) {
        throw new TRPCError({
          code: 'CONFLICT',
          message:
            'An invitation with this name already exists for this event and user',
        })
      }

      const invitationData = {
        email: input.email,
        eventId: input.eventId,
        status: input.status,
      }

      const invitationId =
        await repos.invitationRepository.create(invitationData)

      const emailResult = await sendGiftExchangeInvitation({
        emailReceiver: input.email,
        eventOrganiser: input.eventOrganiser,
        exchangeDate: input.eventDate,
        rsvpLinkYes: `http://localhost:5173/rsvp/${input.eventId}/${invitationId}/accept`,
        rsvpLinkNo: `http://localhost:5173/rsvp/${input.eventId}/${invitationId}/refuse`,
        budgetLimit: input.budgetLimit,
        title: input.title,
        description: input.description,
      })

      if (!emailResult.success) {
        console.error('Failed to send invitation email:', emailResult.error)

        await repos.invitationRepository.update(invitationId, {
          status: 'FAILED',
        })

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Invitation created but failed to send email',
          cause: emailResult.error,
        })
      }

      return {
        success: true,
        invitationId,
        emailSent: true,
        messageId: emailResult.messageId,
      }
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error
      }

      logger.error('Error in invitation process:', error)

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to process invitation',
        cause: error instanceof Error ? error : undefined,
      })
    }
  })
