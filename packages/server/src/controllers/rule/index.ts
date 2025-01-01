import { router } from '@server/trpc'
import create from './create'
import findByEventId from './findByEventId'


export default router({
  create,
  findByEventId
})
