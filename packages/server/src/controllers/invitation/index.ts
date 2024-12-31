import { router } from '@server/trpc'
import create from './create'
import update from './update'
import remove from './remove'
import findAllForUser from './findAllForUser'

export default router({
  create,
  remove,
  update,
  findAllForUser
})
