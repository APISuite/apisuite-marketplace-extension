import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `)
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw('DROP FUNCTION IF EXISTS set_updated_at;')
}
