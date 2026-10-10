'use strict';

const { getPlainText } = require('./api/util');
const { ensureSlug, backfill } = require('./slugs');

// Plain-text copies of tile fields, indexed by strapi-plugin-fuzzy-search
// (see config/plugins.js): blocks field -> text field.
const SEARCH_FIELDS = {
  'api::tile-audio.tile-audio': { content: 'content_search' },
  'api::tile-image.tile-image': {},
  'api::tile-text.tile-text': { description: 'description_search' },
  'api::tile-video.tile-video': {},
};

// The public role used to be allowed to list and delete newsletter
// subscriptions (for the unsubscribe form), which exposed every subscriber's
// name and email. Unsubscribing now goes through POST
// /api/newsletter-subscriptions/unsubscribe; only `create` stays public.
async function restrictNewsletterPermissions(strapi) {
  const prefix = 'api::newsletter-subscription.newsletter-subscription.';
  const role = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });
  if (!role) return;
  const { count } = await strapi.db.query('plugin::users-permissions.permission').deleteMany({
    where: {
      role: { id: role.id },
      action: { $in: ['find', 'findOne', 'update', 'delete'].map((a) => prefix + a) },
    },
  });
  if (count) {
    strapi.log.info(`Removed ${count} public newsletter-subscription permission(s)`);
  }
}

// Recompute the search fields of every tile row (draft and published) from
// its content. Under Strapi 4 they were often left empty (the lifecycles read
// the raw admin request, and tile-audio wrote to a wrong field), so about half
// the tiles couldn't be found by title. Only rows that differ are written.
async function reindexSearchFields(strapi) {
  for (const [uid, fields] of Object.entries(SEARCH_FIELDS)) {
    const rows = await strapi.db.query(uid).findMany({
      select: ['id', 'tile_title', ...Object.keys(fields), ...Object.values(fields)],
      populate: { tile: { select: ['title'] } },
    });
    let updated = 0;
    for (const row of rows) {
      const data = {};
      if ((row.tile?.title ?? null) !== (row.tile_title ?? null)) {
        data.tile_title = row.tile?.title ?? null;
      }
      for (const [source, target] of Object.entries(fields)) {
        const text = getPlainText(row[source]);
        if (text !== (row[target] ?? '')) data[target] = text;
      }
      if (Object.keys(data).length) {
        await strapi.db.query(uid).update({ where: { id: row.id }, data });
        updated++;
      }
    }
    if (updated) strapi.log.info(`Search fields updated for ${updated} ${uid} row(s)`);
  }
}

module.exports = {
  register({ strapi }) {
    // Replaces the v4 lifecycles: document service middlewares run once per
    // document action, not once per draft/published row.
    strapi.documents.use(async (context, next) => {
      const { uid, action, params } = context;
      const data = params?.data;

      if (data && (action === 'create' || action === 'update')) {
        if (uid in SEARCH_FIELDS) {
          // Partial updates (e.g. from the API) may not include these fields
          if (data.tile && 'title' in data.tile) {
            data.tile_title = data.tile.title;
          }
          for (const [source, target] of Object.entries(SEARCH_FIELDS[uid])) {
            if (source in data) {
              data[target] = getPlainText(data[source]);
            }
          }
        }

        await ensureSlug(strapi, context);

        if (uid === 'api::newsletter-subscription.newsletter-subscription' && action === 'create') {
          data.subscription_date = new Date();
        }
      }

      return next();
    });
  },

  async bootstrap({ strapi }) {
    await backfill(strapi);
    await reindexSearchFields(strapi);
    await restrictNewsletterPermissions(strapi);
  },
};
