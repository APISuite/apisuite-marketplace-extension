import { db, OptTransaction } from '../db'
import { App } from './app'

export interface History {
  userId: number
  appId: number
  metadata: object
}

const create = async (trx: OptTransaction, hst: History): Promise<History> => {
  const _db = trx ? trx : db

  const rows = await _db
    .insert(hst)
    .into('history')
    .returning('*')

  return rows[0]
}

export {
  create,
}
