const { getPlainText } = require("../../../util");


module.exports = {
  beforeCreate(event) {
    const {data, where, select, populate} = event.params;
    const ctx = strapi.requestContext.get();
    event.params.data.tile_title = ctx?.request?.body?.tile?.title;
    event.params.data.description_search = getPlainText(ctx?.request?.body?.description);
  },

  beforeUpdate(event) {
    const {data, where, select, populate} = event.params;
    const ctx = strapi.requestContext.get();
    event.params.data.tile_title = ctx?.request?.body?.tile?.title;
    event.params.data.description_search = getPlainText(ctx?.request?.body?.description);
  },
};
