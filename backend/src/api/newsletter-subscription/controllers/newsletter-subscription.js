'use strict';

/**
 * newsletter-subscription controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

const UID = 'api::newsletter-subscription.newsletter-subscription';

module.exports = createCoreController(UID, ({ strapi }) => ({
  // POST /api/newsletter-subscriptions/unsubscribe { email }
  // Deletes on the server, so the public role doesn't need (and doesn't get)
  // permission to list or delete subscriptions.
  async unsubscribe(ctx) {
    const email = String(ctx.request.body?.email || '').trim();
    if (!email) {
      return ctx.badRequest('email is required');
    }
    const { count } = await strapi.db.query(UID).deleteMany({
      where: { email: { $eqi: email } },
    });
    ctx.body = { removed: count > 0 };
  },
}));
