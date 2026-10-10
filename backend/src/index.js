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
  },
};
