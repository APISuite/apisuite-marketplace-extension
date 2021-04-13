import knex, { Knex } from 'knex'
import config from '../config'

const camelToSnakeCase = (str: string): string => {
  return str
    .replace(
      /[A-Z]/g,
      (letter) => `_${letter.toLowerCase()}`
    )
}

const snakeToCamelCase = (str: string) => {
  return str
    .replace(
      /([-_][a-z])/g,
      (group) => group
        .toUpperCase()
        .replace('_', '')
    )
}

export const db = knex({
  client: 'pg',
  connection: config.get('dbURI'),
  searchPath: ['knex', 'public'],
  wrapIdentifier: (value, origImpl) => origImpl(camelToSnakeCase(value)),
  postProcessResponse: (result) => {
    if (result && typeof result === 'object' && Object.prototype.hasOwnProperty.call(result, 'command')) return result

    if (Array.isArray(result)) {
      return result.map((row) => snakeToCamelCase(row))
    }
    return snakeToCamelCase(result)
  },
})

export interface Transaction extends Knex {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  commit(): any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rollback(): any
}

export type OptTransaction = Transaction | null
