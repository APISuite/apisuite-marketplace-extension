exports.up = function(knex) {
  return knex.raw(`
    CREATE TABLE IF NOT EXISTS subscriptions (
        user_id INTEGER NULL,
        app_id INTEGER NULL,
        UNIQUE(user_id, app_id),
        CONSTRAINT fk_app
          FOREIGN KEY(app_id)
          REFERENCES apps(id)
          ON DELETE CASCADE
    );
  `)
}

exports.down = function(knex) {
  return knex.raw('DROP TABLE IF EXISTS subscriptions;')
}
