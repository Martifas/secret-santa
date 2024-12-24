import config from '@server/config'
import { Chance } from 'chance'

export const random = config.isCi ? Chance(1) : Chance()
