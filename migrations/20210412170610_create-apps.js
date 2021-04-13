exports.up = async function(knex) {
  await knex.raw(`
    CREATE TABLE IF NOT EXISTS apps (
        id INTEGER PRIMARY KEY,
        name TEXT,
        description TEXT,
        logo TEXT,
        publisher_id INTEGER,
        publisher_name TEXT,
        updated_at TIMESTAMP NOT NULL DEFAULT now()
    );
  `)

  return knex.raw(`
    CREATE TRIGGER upd_updated_at
    BEFORE UPDATE ON apps
    FOR EACH ROW
    EXECUTE PROCEDURE set_updated_at();
  `)
}

exports.down = function(knex) {
  return knex.raw('DROP TABLE IF EXISTS apps;')
}

