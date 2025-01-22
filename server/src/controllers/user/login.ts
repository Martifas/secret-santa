import bcrypt from 'bcrypt'
import { publicProcedure } from '@server/trpc/index'
import provideRepos from '@server/trpc/provideRepos'
import { userRepository } from '@server/repositories/userRepository'
import { userSchema } from '@server/entities/user'
import { prepareTokenPayload } from '@server/trpc/tokenPayload'
import { TRPCError } from '@trpc/server'
import jsonwebtoken from 'jsonwebtoken'
import config from '@server/config'

const { expiresIn, tokenKey } = config.auth

export default publicProcedure
  .use(provideRepos({ userRepository }))
  .input(
    userSchema.pick({
      email: true,
      password: true,
    })
  )
  .mutation(async ({ input: { email, password }, ctx: { repos, res } }) => {
    if (!res) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Missing response object',
      })
    }

    const user = await repos.userRepository.findByEmail(email)
    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'We could not find an account with this email address',
      })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Incorrect password. Please try again.',
      })
    }

    const payload = prepareTokenPayload(user)
    const accessToken = jsonwebtoken.sign(payload, tokenKey, {
      expiresIn,
    })

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      partitioned: process.env.NODE_ENV === 'production',
      maxAge: 30 * 60 * 1000,
      path: '/',
    })

    return { success: true }
  })
