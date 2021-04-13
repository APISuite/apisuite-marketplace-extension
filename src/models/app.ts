import { db, OptTransaction } from '../db'

export interface App {
  id: number
  name: string
  description: string
  logo: string
  publisherId: number
  publisherName: string
}

export type AppUpdate = Omit<App, 'id' | 'publisherId' | 'publisherName'>

const create = async (trx: OptTransaction, app: App): Promise<App> => {
  const _db = trx ? trx : db

  const res = await _db
    .insert(app)
    .into('apps')
    .onConflict('id')
    .ignore()
    .returning('*')

  return res[0]
}

const update = async (trx: OptTransaction, id: number | string, app: AppUpdate): Promise<App> => {
  const _db = trx ? trx : db

  const rows = await _db('apps')
    .update(app)
    .where('id', id)
    .returning('*')

  return rows[0]
}

const deleteApp = async (trx: OptTransaction, id: number | string): Promise<void> => {
  const _db = trx ? trx : db

  await _db('apps')
    .delete()
    .where('id', id)
    .returning('*')
}

export {
  create,
  update,
  deleteApp,
}
