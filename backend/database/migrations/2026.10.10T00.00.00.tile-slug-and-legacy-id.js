'use strict';

// Adds tiles' `slug` and `legacy_id` columns, and records each tile's
// Strapi 4 id in `legacy_id` (old links like /time/audio_5 redirect to the
// slug URL through it, see src/slugs.js).
//
// Runs before Strapi's own v4 -> v5 migrations, while each tile is still a
// single row with its v4 id; those migrations then copy both columns to the
// draft rows they create. They also require every column of the new schema
// to exist already, which is why the columns are added here.
//
// On a database that is already on Strapi 5 or empty, it only adds missing
// columns.

const TABLES = ['tile_audios', 'tile_images', 'tile_texts', 'tile_videos'];

module.exports = {
  async up(knex) {
    for (const table of TABLES) {
      if (!(await knex.schema.hasTable(table))) continue;

      if (!(await knex.schema.hasColumn(table, 'slug'))) {
        await knex.schema.alterTable(table, (t) => t.string('slug'));
      }
      if (!(await knex.schema.hasColumn(table, 'legacy_id'))) {
        await knex.schema.alterTable(table, (t) => t.integer('legacy_id'));
        // Strapi 4 tables have no document_id: one row per tile, v4 id
        if (!(await knex.schema.hasColumn(table, 'document_id'))) {
          await knex(table).update({ legacy_id: knex.ref('id') });
        }
      }
    }
  },
};
