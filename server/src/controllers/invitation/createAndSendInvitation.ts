import provideRepos from '@server/trpc/provideRepos'
import { eventInvitationSchema } from '@server/entities/eventInvitation'
import { invitationRepository } from '@server/repositories/invitationRepository'
import { TRPCError } from '@trpc/server'
import { sendGiftExchangeInvitation } from '@server/utils/sendEmail'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { logger } from '@server/logger'
import { z } from 'zod'

const emailDataSchema = z.object({
  eventOrganiser: z.string(),
  eventDate: z.date(),
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

      const invitation = await repos.invitationRepository.create(invitationData)

      const emailResult = await sendGiftExchangeInvitation({
        emailReceiver: input.email,
        eventOrganiser: input.eventOrganiser, // Fallback name
        exchangeDate: input.eventDate, // Use event date if available
        rsvpLink: `https://giftmeister.eu/`, // Construct proper URL
      })

      if (!emailResult.success) {
        console.error('Failed to send invitation email:', emailResult.error)

        await repos.invitationRepository.update(invitation.id, {
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
        invitation,
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
