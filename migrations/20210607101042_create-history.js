exports.up = function(knex) {
  return knex.raw(`
    CREATE TABLE IF NOT EXISTS history (
        user_id INTEGER NOT NULL,
        app_id INTEGER NOT NULL,
        metadata JSON NULL, 
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT fk_app
          FOREIGN KEY(app_id)
          REFERENCES apps(id)
          ON DELETE CASCADE
    );
  `)
}

exports.down = function(knex) {
  return knex.raw('DROP TABLE IF EXISTS history;')
}
