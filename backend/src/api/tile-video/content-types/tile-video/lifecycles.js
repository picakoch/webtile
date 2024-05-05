module.exports = {
  beforeCreate(event) {
    const { data, where, select, populate } = event.params;
    const ctx = strapi.requestContext.get();
    event.params.data.tile_title = ctx?.request?.body?.tile?.title;
  },

  beforeUpdate(event) {
    const { data, where, select, populate } = event.params;
    const ctx = strapi.requestContext.get();
    event.params.data.tile_title = ctx?.request?.body?.tile?.title;
  },
};
