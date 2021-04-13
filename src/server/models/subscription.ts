import { db, OptTransaction } from '../../db'

export interface Subscription {
  userId: string
  appId: string
}

export interface App {
  id: number
  name: string
  description: string
  logo: string
  publisherId: number
  publisherName: string
}

const getUserSubscriptions = async(trx: OptTransaction, userId: number): Promise<App[]> => {
  const _db = trx ? trx : db

  const rows = await _db
    .select('apps.*')
    .from('subscriptions')
    .join('apps', 'subscriptions.app_id', 'apps.id')
    .where('subscriptions.user_id', userId)

  return rows[0]
}

const create = async (trx: OptTransaction, sub: Subscription): Promise<Subscription> => {
  const _db = trx ? trx : db

  const rows = await _db
    .insert(sub)
    .into('subscriptions')
    .onConflict()
    .ignore()
    .returning('*')

  return {
    userId: rows[0].user_id,
    appId: rows[0].app_id,
  }
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
