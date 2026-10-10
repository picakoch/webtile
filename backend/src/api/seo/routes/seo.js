'use strict';

// Public SEO endpoints, called by the frontend's nginx (see
// nginx/vhost_frontend.conf), which sets X-Site-Origin / X-Api-Origin:
//   /robots.txt  -> GET /api/seo/robots.txt
//   /sitemap.xml -> GET /api/seo/sitemap.xml
//   index.html   -> GET /api/seo/head?path=/time/audio/retour-a-la-mer
//                   (<title>, description, canonical, Open Graph tags, included
//                   with SSI so link previews work without running JavaScript)
module.exports = {
  routes: [
    { method: 'GET', path: '/seo/robots.txt', handler: 'seo.robots', config: { auth: false } },
    { method: 'GET', path: '/seo/sitemap.xml', handler: 'seo.sitemap', config: { auth: false } },
    { method: 'GET', path: '/seo/head', handler: 'seo.head', config: { auth: false } },
  ],
};
