import { db, OptTransaction } from '../db'
import { App } from './app'

export interface Subscription {
  userId: number
  appId: number
}

const getUserSubscriptions = async(trx: OptTransaction, userId: number): Promise<App[]> => {
  const _db = trx ? trx : db

  const rows = await _db
    .select('apps.*')
    .from('subscriptions')
    .join('apps', 'subscriptions.app_id', 'apps.id')
    .where('subscriptions.user_id', userId)

  return rows
}

const create = async (trx: OptTransaction, sub: Subscription): Promise<Subscription> => {
  const _db = trx ? trx : db

  const rows = await _db
    .insert(sub)
    .into('subscriptions')
    .onConflict(['user_id', 'app_id'])
    .ignore()
    .returning('*')

  return rows[0]
}

const deleteSubscription = async (trx: OptTransaction, sub: Subscription): Promise<void> => {
  const _db = trx ? trx : db

  await _db('subscriptions')
    .delete()
    .where(sub)
    .returning('*')
}

export {
  getUserSubscriptions,
  create,
  deleteSubscription,
}
