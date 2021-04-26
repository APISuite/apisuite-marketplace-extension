exports.up = async function(knex) {
  return knex.raw(`
    ALTER TABLE apps ADD COLUMN IF NOT EXISTS short_description TEXT;
  `)
}

exports.down = function(knex) {
  return knex.raw(`
    ALTER TABLE apps DROP COLUMN IF EXISTS short_description;
  `)
}

