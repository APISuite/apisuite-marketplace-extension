import amqp from 'amqp-connection-manager'
import amqplib from 'amqplib'
import config from '../config'
import log from '../log'
import {
  handleAppCreate,
  handleAppUpdate,
  handleAppDelete,
} from './handlers'
import { routingKeys } from './types'

const onMessage = (data: amqplib.ConsumeMessage | null): void => {
  if (!data || !data.fields || !data.fields.routingKey) {
    log.error('invalid rabbitmq msg', '[msg broker onMessage]')
    return
  }

  try {
    const msg = JSON.parse(data.content.toString())

    switch (data.fields.routingKey) {
      case routingKeys.APP_CREATED: {
        if (!msg || !msg.app_id || !msg.meta) {
          log.warn('could not create app', msg)
          break
        }
        const meta = msg.meta
        handleAppCreate({
          id: meta.id,
          name: meta.name,
          description: meta.shortDescription,
          logo: meta.logo,
          publisherId: meta.org.id,
          publisherName: meta.org.name,
        }).catch((err) => log.error(err))
        break
      }
      case routingKeys.APP_UPDATED: {
        if (!msg || !msg.app_id || !msg.meta) {
          log.warn('could not update app', msg)
          break
        }
        const meta = msg.meta
        handleAppUpdate({
          id: meta.id,
          name: meta.name,
          description: meta.shortDescription,
          logo: meta.logo,
          publisherId: meta.org.id,
          publisherName: meta.org.name,
        }).catch((err) => log.error(err))
        break
      }
      case routingKeys.APP_DELETED: {
        if (!msg || !msg.app_id) {
          log.warn('could not delete app', msg)
          break
        }
        handleAppDelete(msg.app_id).catch()
        break
      }
    }
  } catch(err) {
    log.error(err, '[msg broker onMessage]')
  }
}

export const init = () => {
  const connection = amqp.connect([config.get('msgBroker.url')])
  connection.on('connect', () => log.info('Connected to Message Broker'))
  connection.on('disconnect', (err) => log.error(err, '[msg broker]'))

  connection.createChannel({
    setup: (channel: amqplib.ConfirmChannel) => (
      Promise.all([
        channel.assertQueue(config.get('msgBroker.queue'), { exclusive: true, autoDelete: true }),
        channel.assertExchange(config.get('msgBroker.eventsExchange'), 'topic'),
        channel.bindQueue(config.get('msgBroker.queue'), config.get('msgBroker.eventsExchange'), '#'),
        channel.consume(config.get('msgBroker.queue'), onMessage),
      ])
    ),
  })
}
