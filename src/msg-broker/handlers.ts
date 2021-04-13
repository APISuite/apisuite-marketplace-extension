import {
  App,
  create,
  update,
  deleteApp,
} from '../models/app'

export const handleAppCreate = async (app: App): Promise<void> => {
  await create(null, app)
}

export const handleAppUpdate = async (app: App): Promise<void> => {
  await update(null, app.id, {
    name: app.name,
    description: app.description,
    logo: app.logo,
  })
}

export const handleAppDelete = async (appId: string): Promise<void> => {
  await deleteApp(null, appId)
}
