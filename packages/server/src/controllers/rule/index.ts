import { router } from '@server/trpc'
import create from './create'
import findByEventId from './findByEventId'
import remove from './remove'
import update from './update'


export default router({
  create,
  findByEventId,
  remove,
  update
})
