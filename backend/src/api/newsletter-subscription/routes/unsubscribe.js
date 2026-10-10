'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/newsletter-subscriptions/unsubscribe',
      handler: 'newsletter-subscription.unsubscribe',
      config: { auth: false },
    },
  ],
};
