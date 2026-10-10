import { Mail } from '@strapi/icons';

const config = {
  locales: [
     'fr',
     'en',
  ],
};

const register = (app) => {
  app.addMenuLink({
    to: 'newsletter-export',
    icon: Mail,
    intlLabel: { id: 'newsletter-export.menu', defaultMessage: 'Newsletter export' },
    Component: () => import('./pages/NewsletterExport'),
    permissions: [
      {
        action: 'plugin::content-manager.explorer.read',
        subject: 'api::newsletter-subscription.newsletter-subscription',
      },
    ],
  });
};

export default {
  config,
  register,
};
