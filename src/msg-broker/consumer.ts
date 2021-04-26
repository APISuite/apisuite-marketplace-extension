import amqplib from 'amqplib'
import log from '../log'
import { routingKeys } from './types'
import {
  handleAppDelete,
  handleAppUpdate,
  handleOrgUpdate,
} from './handlers'
import { App } from '../models/app'

interface AppMeta {
  id: string
  name: string
  description: string
  shortDescription: string
  logo: string
  visibility: string
  state: string
  org: {
    id: string
    name: string
  }
}

interface AppMessage {
  app_id: string
  meta: AppMeta
}

interface OrgMessage {
  organization_id: string
  meta: {
    id: string
    name: string
  }
}

const validateAppMessage = (msg: AppMessage): boolean => {
  return !!(
    msg &&
    msg.app_id &&
    msg.meta &&
    msg.meta.visibility && msg.meta.visibility.length &&
    msg.meta.state && msg.meta.state.length
  )
}

const validateOrgMessage = (msg: OrgMessage): boolean => {
  return !!(
    msg &&
    msg.organization_id &&
    msg.meta &&
    msg.meta.id &&
    msg.meta.name && msg.meta.name.length
  )
}

const isPublicApp = (meta: AppMeta): boolean => {
  return meta.visibility === 'public' && meta.state === 'approved'
}

const appMetaToInternal = (meta: AppMeta): App => ({
  id: Number(meta.id),
  name: meta.name,
  shortDescription: meta.shortDescription,
  description: meta.description,
  logo: meta.logo,
  publisherId: Number(meta.org.id),
  publisherName: meta.org.name,
})

export const onMessage = (data: amqplib.ConsumeMessage | null): void => {
  if (!data || !data.fields || !data.fields.routingKey) {
    log.error('invalid msg', '[msg broker onMessage]')
    return
  }

  try {
    const msg = JSON.parse(data.content.toString())

    switch (data.fields.routingKey) {
      case routingKeys.APP_REQUESTED:
      case routingKeys.APP_UPDATED: {
        if (!validateAppMessage(msg)) {
          log.warn('could not update app', msg)
          break
        }
        if (!isPublicApp(msg.meta)) break
        handleAppUpdate(appMetaToInternal(msg.meta))
          .catch((err) => log.error(err))
        break
      }
      case routingKeys.APP_DELETED: {
        if (!validateAppMessage(msg)) {
          log.warn('could not delete app', msg)
          break
        }
        handleAppDelete(msg.app_id).catch()
        break
      }
      case routingKeys.ORG_UPDATED: {
        if (!validateOrgMessage(msg)) {
          log.warn('could not update apps', msg)
          break
        }
        handleOrgUpdate(msg.meta.id, msg.meta.name)
          .catch((err) => log.error(err))
        break
      }
    }
  } catch(err) {
    log.error(err, '[msg broker onMessage]')
  }
}