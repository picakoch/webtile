module.exports = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
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
