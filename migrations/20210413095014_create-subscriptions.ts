import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    CREATE TABLE IF NOT EXISTS subscriptions (
        user_id INTEGER NULL,
        app_id INTEGER NULL,
        UNIQUE(user_id, app_id),
        CONSTRAINT fk_user
          FOREIGN KEY(app_id)
          REFERENCES apps(id)
          ON DELETE CASCADE
    );
  `)
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw('DROP TABLE IF EXISTS subscriptions;')
}
