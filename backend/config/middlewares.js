module.exports = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: [
        'http://localhost:4080',
        'http://127.0.0.1:4080',
        'https://autourdeminuit-jazz.fr',
        'https://www.autourdeminuit-jazz.fr',
      ],
      headers: ['Content-Type', 'Authorization'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  {
    name: "strapi::body",
    config: {
      formLimit: "2560mb", // modify form body
      jsonLimit: "2560mb", // modify JSON body
      textLimit: "2560mb", // modify text body
      formidable: {
        maxFileSize: 2500 * 1024 * 1024, // multipart data, modify here limit of uploaded file size
      },
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  { resolve: 'src/middlewares/admin-redirect' },
];
