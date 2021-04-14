import {
  App,
  upsert,
  deleteApp,
  updateOrganization,
} from '../models/app'

export const handleAppUpdate = async (app: App): Promise<void> => {
  await upsert(null, app)
}

export const handleAppDelete = async (appId: string): Promise<void> => {
  await deleteApp(null, appId)
}

export const handleOrgUpdate = async (id: string, name: string): Promise<void> => {
  await updateOrganization(null, id, name)
}