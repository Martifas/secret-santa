import { router } from '@server/trpc'
import find from './find'
import create from './create'
import update from './update'
import remove from './remove'
import findAllForUser from './findAllForUser'

export default router({
  find,
  findAllForUser,
  create,
  remove,
  update,
})
