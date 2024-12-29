import { router } from '@server/trpc'
import find from './find'
import findAll from './findAll'
import create from './create'
import update from './update'
import remove from './remove'

export default router({
  find,
  findAll,
  create,
  remove,
  update,
})
